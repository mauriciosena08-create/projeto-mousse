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
    $itens = json_encode($data['itens'] ?? []);
    $total = $data['total'] ?? 0;
    $dataHora = date('Y-m-d H:i:s');

    $stmt = $db->prepare("INSERT INTO pedidos (cliente, itens, total, data) VALUES (:cliente, :itens, :total, :data)");
    $stmt->execute([
        ':cliente' => $cliente,
        ':itens' => $itens,
        ':total' => $total,
        ':data' => $dataHora
    ]);

    echo json_encode(["sucesso" => true, "mensagem" => "Pedido salvo com sucesso!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar pedido: " . $e->getMessage()]);
}
?>
