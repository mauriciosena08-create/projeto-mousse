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

$nome    = trim($data['nome'] ?? '');
$senha   = trim($data['senha'] ?? '');
$curso   = trim($data['curso'] ?? '');
$periodo = trim($data['periodo'] ?? '');

if (empty($nome) || empty($senha) || empty($curso) || empty($periodo)) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Todos os campos são obrigatórios."]);
    exit;
}

try {
    // Insere na tabela 'usuarios' com as colunas corretas existentes no SQLite
    $stmt = $db->prepare("INSERT INTO usuarios (nome, senha, curso, periodo) VALUES (:nome, :senha, :curso, :periodo)");
    $stmt->execute([
        ':nome'    => $nome,
        ':senha'   => password_hash($senha, PASSWORD_DEFAULT),
        ':curso'   => $curso,
        ':periodo' => $periodo
    ]);

    echo json_encode(["sucesso" => true, "mensagem" => "Usuário cadastrado com sucesso!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar no banco: " . $e->getMessage()]);
}
?>
