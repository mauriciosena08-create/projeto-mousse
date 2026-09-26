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

$id = intval($data['id'] ?? 0);
$status = trim($data['status'] ?? '');

if ($id <= 0 || empty($status)) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "ID do pedido e novo status são obrigatórios."]);
    exit();
}

try {
    execute_turso_query(
        "UPDATE pedidos SET status = ? WHERE id = ?",
        [$status, $id]
    );

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Status do pedido atualizado com sucesso!"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao atualizar status: " . $e->getMessage()
    ]);
}
?>
