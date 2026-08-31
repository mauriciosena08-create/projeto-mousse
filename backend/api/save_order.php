<?php
require_once __DIR__ . '/database.php';

$dados = json_decode(file_get_contents("php://input"), true);

$usuario_id = $dados['usuario_id'] ?? null;
$itens      = $dados['itens'] ?? []; 

if (!$usuario_id || empty($itens) || !is_array($itens)) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Dados do pedido inválidos!"]);
    exit();
}

try {
    $db->beginTransaction();
    $dataAtual = date('Y-m-d H:i:s');

    $stmtCheckEstoque = $db->prepare("SELECT quantidade_disponivel FROM estoque WHERE id = :produto_id");
    $stmtPedido       = $db->prepare("INSERT INTO pedidos (usuario_id, produto_id, status, data) VALUES (:usuario_id, :produto_id, 'Pendente', :data)");
    $stmtBaixaEstoque = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE id = :produto_id");

    foreach ($itens as $item) {
        $produto_id = $item['produto_id'] ?? null;
        $quantidade = intval($item['quantidade'] ?? 1);

        if (!$produto_id || $quantidade <= 0) continue;

        // Verifica o estoque
        $stmtCheckEstoque->execute([':produto_id' => $produto_id]);
        $estoqueAtual = $stmtCheckEstoque->fetch(PDO::FETCH_ASSOC);

        if (!$estoqueAtual || $estoqueAtual['quantidade_disponivel'] < $quantidade) {
            $db->rollBack();
            http_response_code(400);
            echo json_encode(["sucesso" => false, "mensagem" => "Estoque insuficiente para o produto ID {$produto_id}!"]);
            exit();
        }

        // Registra cada item pedido
        for ($i = 0; $i < $quantidade; $i++) {
            $stmtPedido->execute([
                ':usuario_id' => $usuario_id,
                ':produto_id' => $produto_id,
                ':data'       => $dataAtual
            ]);
        }

        // Subtrai do estoque
        $stmtBaixaEstoque->execute([
            ':qtd'        => $quantidade,
            ':produto_id' => $produto_id
        ]);
    }

    $db->commit();
    echo json_encode(["sucesso" => true, "mensagem" => "Pedido(s) registrado(s) com sucesso!"]);

} catch (PDOException $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao registrar o pedido no banco."]);
}
?>