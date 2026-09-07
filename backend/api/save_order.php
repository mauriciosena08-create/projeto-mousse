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
    $cliente = $data['cliente'] ?? '';
    $itensArray = $data['itens'] ?? [];
    $itens = json_encode($itensArray);
    $total = $data['total'] ?? 0;
    $dataHora = date('Y-m-d H:i:s');

    // Transação SQLite
    $db->beginTransaction();

    // 1. Salva o pedido
    $stmt = $db->prepare("INSERT INTO pedidos (cliente, itens, total, data) VALUES (:cliente, :itens, :total, :data)");
    $stmt->execute([
        ':cliente' => $cliente,
        ':itens'   => $itens,
        ':total'   => $total,
        ':data'    => $dataHora
    ]);

    // 2. Subtrai o estoque no SQLite
    if (is_array($itensArray)) {
        // Tenta atualizar garantindo case-insensitive (LOWER/TRIM)
        $stmtEstoque = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE LOWER(TRIM(produto)) = LOWER(TRIM(:produto))");
        
        foreach ($itensArray as $item) {
            $nomeProduto = $item['produto'] ?? '';
            $qtdComprada = (int)($item['quantidade'] ?? $item['quant'] ?? 0);

            if (!empty($nomeProduto) && $qtdComprada > 0) {
                $stmtEstoque->execute([
                    ':qtd'     => $qtdComprada,
                    ':produto' => $nomeProduto
                ]);

                // Se não alterou nenhuma linha, tenta na coluna 'quantidade' (caso seu nome de coluna no SQLite seja diferente)
                if ($stmtEstoque->rowCount() === 0) {
                    $stmtAlt = $db->prepare("UPDATE estoque SET quantidade = quantidade - :qtd WHERE LOWER(TRIM(produto)) = LOWER(TRIM(:produto))");
                    $stmtAlt->execute([
                        ':qtd'     => $qtdComprada,
                        ':produto' => $nomeProduto
                    ]);
                }
            }
        }
    }

    $db->commit();

    echo json_encode(["sucesso" => true, "mensagem" => "Pedido salvo e estoque atualizado com sucesso!"]);
} catch (PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar pedido: " . $e->getMessage()]);
}
?>
