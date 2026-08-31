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


$stmt = $db->prepare("INSERT INTO usuarios (nome, senha, curso, periodo) VALUES (:nome, :senha, :curso, :periodo)");
$stmt->execute([
    ':nome' 
    => $nome,
    ':senha' => $senha,
    ':curso' => $curso,
    ':periodo' => $periodo
]);
echo json_encode(['sucesso' => true, 'mensagem' => 'Usuário registrado com sucesso!']);