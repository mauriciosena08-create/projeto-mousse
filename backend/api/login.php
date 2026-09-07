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

$nome = trim($data['nome'] ?? '');
$senha = trim($data['senha'] ?? '');

if (empty($nome) || empty($senha)) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Preencha o nome e a senha."]);
    exit();
}

try {
    $stmt = $db->prepare("SELECT * FROM usuarios WHERE nome = :nome");
    $stmt->execute([':nome' => $nome]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($senha, $usuario['senha'])) {
        unset($usuario['senha']); // Remove o hash da senha por segurança

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Login realizado com sucesso!",
            "usuario" => $usuario
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["sucesso" => false, "mensagem" => "Usuário ou senha incorretos."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro interno: " . $e->getMessage()]);
}
?>
