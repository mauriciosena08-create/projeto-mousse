<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$nome     = trim($data['nome'] ?? '');
$email    = trim($data['email'] ?? '');
$senha    = trim($data['senha'] ?? '');
$telefone = trim($data['telefone'] ?? '');

if (empty($nome) || empty($email) || empty($senha)) {
    echo json_encode(["sucesso" => false, "mensagem" => "Todos os campos são obrigatórios."]);
    exit;
}

try {
    $stmt = $db->prepare("INSERT INTO users (nome, email, senha, telefone) VALUES (:nome, :email, :senha, :telefone)");
    $stmt->execute([
        ':nome'     => $nome,
        ':email'    => $email,
        ':senha'    => password_hash($senha, PASSWORD_DEFAULT),
        ':telefone' => $telefone
    ]);

    echo json_encode(["sucesso" => true, "mensagem" => "Usuário cadastrado com sucesso!"]);
} catch (PDOException $e) {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar no banco: " . $e->getMessage()]);
}
