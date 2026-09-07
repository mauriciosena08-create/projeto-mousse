<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ob_start();
error_reporting(0);
ini_set('display_errors', 0);

require_once __DIR__ . '/database.php';
ob_clean();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Dados inválidos."]);
    exit();
}

try {
    $cliente = $data['cliente'] ?? $data['usuario_id'] ?? 'Anônimo';
    $itensArray = $data['itens'] ?? [];
    $itens = json_encode($itensArray);
    $total = $data['total'] ?? 0;
    $dataHora = date('Y-m-d H:i:s');

    // Inicia transação SQLite
    $db->beginTransaction();

    // 1. Grava o pedido
    $stmt = $db->prepare("INSERT INTO pedidos (cliente, itens, total, data) VALUES (:cliente, :itens, :total, :data)");
    $stmt->execute([
        ':cliente' => $cliente,
        ':itens'   => $itens,
        ':total'   => $total,
        ':data'    => $dataHora
    ]);

    // 2. Atualiza o estoque no SQLite
    if (is_array($itensArray)) {
        // Prepara queries flexíveis para nome ou ID
        $stmtNome = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE LOWER(TRIM(produto)) = LOWER(TRIM(:produto))");
        $stmtAltNome = $db->prepare("UPDATE estoque SET quantidade = quantidade - :qtd WHERE LOWER(TRIM(produto)) = LOWER(TRIM(:produto))");
        
        $stmtId = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE id = :id");
        $stmtAltId = $db->prepare("UPDATE estoque SET quantidade = quantidade - :qtd WHERE id = :id");

        foreach ($itensArray as $item) {
            $nomeProduto = $item['produto'] ?? $item['nome'] ?? '';
            $idProduto = $item['produto_id'] ?? $item['id'] ?? null;
            $qtdComprada = (int)($item['quantidade'] ?? $item['quant'] ?? 1);

            if ($qtdComprada > 0) {
                // Tenta atualizar pelo Nome
                if (!empty($nomeProduto)) {
                    $stmtNome->execute([':qtd' => $qtdComprada, ':produto' => $nomeProduto]);
                    
                    if ($stmtNome->rowCount() === 0) {
                        $stmtAltNome->execute([':qtd' => $qtdComprada, ':produto' => $nomeProduto]);
                    }
                } 
                // Se não tiver nome, tenta atualizar pelo ID
                elseif ($idProduto) {
                    $stmtId->execute([':qtd' => $qtdComprada, ':id' => $idProduto]);
                    
                    if ($stmtId->rowCount() === 0) {
                        $stmtAltId->execute([':qtd' => $qtdComprada, ':id' => $idProduto]);
                    }
                }
            }
        }
    }

    $db->commit();

    echo json_encode(["sucesso" => true, "mensagem" => "Pedido salvo e estoque atualizado!"]);
} catch (PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar pedido: " . $e->getMessage()]);
}
?>
