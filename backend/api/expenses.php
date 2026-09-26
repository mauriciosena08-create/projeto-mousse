<?php
require_once __DIR__ . '/database.php';

$dadosRecebidos = file_get_contents("php://input");
$custo = json_decode($dadosRecebidos, true);

$item = $custo['item'] ?? null;
$quantidade = $custo['quantidade'] ?? null;
$valor = $custo['valor'] ?? null;
$data = $custo['data'] ?? null;

if (is_null($item) || is_null($quantidade) || is_null($valor) || is_null($data)) {
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Por favor, informe todos os campos!"
    ]);
    exit();
}

try {
    execute_turso_query(
        "INSERT INTO gastos (item, quantidade, valor, data) VALUES (?, ?, ?, ?)",
        [$item, (int)$quantidade, (float)$valor, $data]
    );

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Despesa registrada com sucesso!"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao registrar a despesa: " . $e->getMessage()
    ]);
}
?>
