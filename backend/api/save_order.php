<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . '/database.php';

    // Garante que o PDO lance exceções em erros do SQL
    if (isset($db)) {
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Dados inválidos recebidos."]);
        exit();
    }

    $cliente = trim($data['cliente'] ?? $data['nome'] ?? $data['usuario_nome'] ?? '');

    // BLOQUEIO: Se não houver cliente ou for Anônimo, impede a criação do pedido
    if (empty($cliente) || strtolower($cliente) === 'anônimo' || strtolower($cliente) === 'anonimo') {
        http_response_code(401);
        echo json_encode([
            "sucesso" => false, 
            "mensagem" => "É necessário estar logado para realizar um pedido."
        ]);
        exit();
    }

    $itensArray = $data['itens'] ?? [];
    $itensJson = json_encode($itensArray);
    $total = $data['total'] ?? 0;
    $status = 'Pendente';
    $dataHora = date('Y-m-d H:i:s');

    // 1. Grava o pedido com a coluna status
    $stmt = $db->prepare("INSERT INTO pedidos (cliente, itens, total, status, data) VALUES (:cliente, :itens, :total, :status, :data)");
    $stmt->execute([
        ':cliente' => $cliente,
        ':itens'   => $itensJson,
        ':total'   => $total,
        ':status'  => $status,
        ':data'    => $dataHora
    ]);

    // 2. Atualiza cada item no estoque
    if (is_array($itensArray)) {
        foreach ($itensArray as $item) {
            $nomeProduto = trim($item['produto'] ?? $item['nome'] ?? '');
            $qtdComprada = (int)($item['quantidade'] ?? $item['quant'] ?? 1);
            $idProduto = $item['id'] ?? $item['produto_id'] ?? null;

            if ($qtdComprada <= 0) continue;

            // Tenta atualizar pelo ID (se fornecido)
            if ($idProduto) {
                try {
                    $stmtId = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE id = :id");
                    $stmtId->execute([':qtd' => $qtdComprada, ':id' => $idProduto]);
                } catch (PDOException $e) {
                    $stmtId = $db->prepare("UPDATE estoque SET quantidade = quantidade - :qtd WHERE id = :id");
                    $stmtId->execute([':qtd' => $qtdComprada, ':id' => $idProduto]);
                }
            } 
            // Se não tiver ID, atualiza pelo nome do produto
            elseif (!empty($nomeProduto)) {
                try {
                    $stmtNome = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE LOWER(produto) = LOWER(:produto)");
                    $stmtNome->execute([':qtd' => $qtdComprada, ':produto' => $nomeProduto]);
                } catch (PDOException $e) {
                    $stmtAlt = $db->prepare("UPDATE estoque SET quantidade = quantidade - :qtd WHERE LOWER(produto) = LOWER(:produto)");
                    $stmtAlt->execute([':qtd' => $qtdComprada, ':produto' => $nomeProduto]);
                }
            }
        }
    }

    echo json_encode(["sucesso" => true, "mensagem" => "Pedido realizado com sucesso!"]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Erro no servidor: " . $e->getMessage()
    ]);
}
?>
