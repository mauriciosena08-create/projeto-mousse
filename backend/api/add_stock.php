<?php
require_once __DIR__ . '/database.php';

$dados = json_decode(file_get_contents("php://input"), true);

$produto    = trim($dados['produto'] ?? '');
$quantidade = intval($dados['quantidade'] ?? 0);
//Verifica se ta vazio ou se tem qtd
if (empty($produto) || $quantidade <= 0) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe o nome do produto e a quantidade!"]);
    exit();
}

try {
    $dataAtual = date('Y-m-d H:i:s');

    $stmtCheck = $db->prepare("SELECT id FROM estoque WHERE produto = :produto");
    $stmtCheck->execute([':produto' => $produto]);
    $itemExistente = $stmtCheck->fetch(PDO::FETCH_ASSOC);
//atualiza o produto no banco de dados
    if ($itemExistente) {
        $stmtUpdate = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel + :qtd, data = :data WHERE id = :id");
        $stmtUpdate->execute([
            ':qtd'  => $quantidade,
            ':data' => $dataAtual,
            ':id'   => $itemExistente['id']
        ]);
        echo json_encode(["sucesso" => true, "mensagem" => "Estoque atualizado com sucesso!"]);
    } else {
        //cria um novo produto
        $stmtInsert = $db->prepare("INSERT INTO estoque (produto, quantidade_disponivel, data) VALUES (:produto, :qtd, :data)");
        $stmtInsert->execute([
            ':produto' => $produto,
            ':qtd'     => $quantidade,
            ':data'    => $dataAtual
        ]);
        echo json_encode(["sucesso" => true, "mensagem" => "Novo produto cadastrado no estoque!"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar no estoque."]);
}
?>