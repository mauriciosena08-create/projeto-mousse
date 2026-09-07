<?php
require_once __DIR__ . '/database.php';
$dados = json_decode(file_get_contents('php://input'), true);
$nome = trim($dados['nome']);
$senha = trim($dados['senha']);
$curso = trim($dados['curso']);
$periodo = trim($dados['periodo']);
//// verifica espaço vazio
if (empty($nome) || empty($senha) || empty($curso) || empty($periodo)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Todos os campos são obrigatórios.']);
    exit();
}
// verifica se o usuário já existe
$stmt = $db->prepare("SELECT * FROM usuarios WHERE nome = :nome");
$stmt->execute([':nome' => $nome]);
if ($stmt->fetch()) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Nome de usuário já existe.']);
    exit();
}


$stmt = $db->prepare("INSERT INTO usuarios (nome, senha, curso, periodo) VALUES (:nome, :senha, :curso, :periodo)");<?php
// Desativa exibição de Warnings/Errors em texto para não quebrar a resposta JSON
error_reporting(0);
ini_set('display_errors', 0);

// Headers de CORS e tipo de conteúdo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/database.php';

// Lê o corpo da requisição JSON enviada pelo Next.js
$data = json_decode(file_get_contents("php://input"), true);

// Coleta os valores com segurança contra nulos
$nome     = trim($data['nome'] ?? '');
$email    = trim($data['email'] ?? '');
$senha    = trim($data['senha'] ?? '');
$telefone = trim($data['telefone'] ?? '');

if (empty($nome) || empty($email) || empty($senha)) {
    echo json_encode(["sucesso" => false, "mensagem" => "Todos os campos são obrigatórios."]);
    exit;
}

try {
    // Insere no banco SQLite
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
$stmt->execute([
    ':nome' 
    => $nome,
    ':senha' => $senha,
    ':curso' => $curso,
    ':periodo' => $periodo
]);
echo json_encode(['sucesso' => true, 'mensagem' => 'Usuário registrado com sucesso!']);
