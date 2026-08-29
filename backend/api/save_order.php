<?php
// Conectamos com o banco de dados carregando o arquivo database.php
require_once __DIR__ . '/database.php';

// Pegamos as informações enviadas pelo aplicativo/site (em formato JSON)
$dadosRecebidos = file_get_contents("php://input");
$pedido = json_decode($dadosRecebidos, true);

//  Guardamos o ID do cliente e o ID do produto em variáveis simples
$usuario_id = $pedido['usuario_id'] ?? null;
$produto_id = $pedido['produto_id'] ?? null;

// Checamos se veio alguma informação faltando
if (!$usuario_id || !$produto_id) {
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Por favor, informe o usuário e o produto!"
    ]);
    exit(); // Para a execução do código aqui
}

//  Vamos no banco ver se esse produto existe e se tem quantidade disponível
$consultaEstoque = $db->prepare("SELECT quantidade_disponivel FROM estoque WHERE id = :produto_id");
$consultaEstoque->execute([':produto_id' => $produto_id]);
$item = $consultaEstoque->fetch(PDO::FETCH_ASSOC);

// Se o produto não existe OU a quantidade for 0 ou menor, cancelamos
if (!$item || $item['quantidade_disponivel'] <= 0) {
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Ops! Esse produto está esgotado."
    ]);
    exit();
}

// Guardamos o pedido na tabela 'pedidos'
$dataAtual = date('Y-m-d H:i:s'); // Pega a data e hora de agora

$salvar = $db->prepare("INSERT INTO pedidos (usuario_id, produto_id, status, data) VALUES (:usuario_id, :produto_id, 'Pendente', :data)");
$salvar->execute([
    ':usuario_id' => $usuario_id,
    ':produto_id' => $produto_id,
    ':data'       => $dataAtual
]);

// Tiramos 1 unidade do produto que acabou de ser vendido
$diminuirEstoque = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = :produto_id");
$diminuirEstoque->execute([':produto_id' => $produto_id]);

// Avisamos para o site/app que deu tudo certo!
echo json_encode([
    "sucesso" => true,
    "mensagem" => "Pedido realizado com sucesso!"
]);
?>