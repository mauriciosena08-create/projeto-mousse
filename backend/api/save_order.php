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

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "Dados inválidos recebidos."]);
        exit();
    }

    $cliente = trim($data['cliente'] ?? $data['nome'] ?? $data['usuario_nome'] ?? '');

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
    $total = (float)($data['total'] ?? 0);
    $status = 'Pendente';
    $dataHora = date('Y-m-d H:i:s');

    execute_turso_query(
        "INSERT INTO pedidos (cliente, itens, total, status, data) VALUES (?, ?, ?, ?, ?)",
        [$cliente, $itensJson, $total, $status, $dataHora]
    );

    if (is_array($itensArray)) {
        foreach ($itensArray as $item) {
            $nomeProduto = trim($item['produto'] ?? $item['nome'] ?? '');
            $qtdComprada = (int)($item['quantidade'] ?? $item['quant'] ?? 1);
            $idProduto = $item['id'] ?? $item['produto_id'] ?? null;

            if ($qtdComprada <= 0) continue;

            if ($idProduto) {
                execute_turso_query(
                    "UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - ? WHERE id = ?",
                    [$qtdComprada, (int)$idProduto]
                );
            } elseif (!empty($nomeProduto)) {
                execute_turso_query(
                    "UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - ? WHERE LOWER(produto) = LOWER(?)",
                    [$qtdComprada, $nomeProduto]
                );
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
