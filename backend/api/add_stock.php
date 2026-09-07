<?php
// Permite requisições de qualquer origem (Vercel, localhost, etc.)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Trata a requisição preflight (OPTIONS) feita pelo navegador
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Desativa exibição de erros HTML que quebram a resposta JSON
ob_start();
error_reporting(0);
ini_set('display_errors', 0);

require_once __DIR__ . '/database.php';
ob_clean();

$data = json_decode(file_get_contents("php://input"), true);

$produto = trim($data['produto'] ?? '');
$quantidade = intval($data['quantidade'] ?? 0);

if (empty($produto) || $quantidade <= 0) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe um produto e uma quantidade válida."]);
    exit;
}

try {
    $stmt = $db->prepare("
        INSERT INTO estoque (produto, quantidade_disponivel, data) 
        VALUES (:produto, :quantidade, :data)
        ON CONFLICT(produto) DO UPDATE SET 
            quantidade_disponivel = quantidade_disponivel + :quantidade,
            data = :data
    ");

    $stmt->execute([
        ':produto' => $produto,
        ':quantidade' => $quantidade,
        ':data' => date('Y-m-d H:i:s')
    ]);

    echo json_encode(["sucesso" => true, "mensagem" => "Estoque atualizado com sucesso!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar no estoque: " . $e->getMessage()]);
}
?>
