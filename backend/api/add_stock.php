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

$produto = trim($data['produto'] ?? '');
$quantidade = intval($data['quantidade'] ?? 0);
$imagem = trim($data['imagem'] ?? '');

if (empty($produto) || $quantidade <= 0) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe um produto e uma quantidade válida."]);
    exit;
}

try {
    $resCheck = execute_turso_query("SELECT id, quantidade_disponivel, imagem FROM estoque WHERE LOWER(produto) = LOWER(?)", [$produto]);
    $itens = turso_fetch_assoc($resCheck);
    $itemExistente = $itens[0] ?? null;

    $dataAtual = date('Y-m-d H:i:s');

    if ($itemExistente) {
        $novaQtd = (int)$itemExistente['quantidade_disponivel'] + $quantidade;
        $novaImagem = !empty($imagem) ? $imagem : ($itemExistente['imagem'] ?? '');

        execute_turso_query(
            "UPDATE estoque SET quantidade_disponivel = ?, imagem = ?, data = ? WHERE id = ?",
            [$novaQtd, $novaImagem, $dataAtual, (int)$itemExistente['id']]
        );
    } else {
        execute_turso_query(
            "INSERT INTO estoque (produto, quantidade_disponivel, imagem, data) VALUES (?, ?, ?, ?)",
            [$produto, $quantidade, $imagem, $dataAtual]
        );
    }

    echo json_encode(["sucesso" => true, "mensagem" => "Estoque atualizado com sucesso!"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro no banco: " . $e->getMessage()]);
}
?>
