<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . '/database.php';

    if (isset($db)) {
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    $id = $data['id'] ?? null;
    $status = $data['status'] ?? 'Concluído';

    if (!$id) {
        http_response_code(400);
        echo json_encode(["sucesso" => false, "mensagem" => "ID do pedido não informado."]);
        exit();
    }

    $stmt = $db->prepare("UPDATE pedidos SET status = :status WHERE id = :id");
    $stmt->execute([':status' => $status, ':id' => $id]);

    echo json_encode(["sucesso" => true, "mensagem" => "Status atualizado com sucesso!"]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro no servidor: " . $e->getMessage()]);
}
?>
