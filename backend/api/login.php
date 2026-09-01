<?php
require_once __DIR__ . '/database.php';

$dados = json_decode(file_get_contents("php://input"), true);
$nome = trim($dados['nome'] ?? '');
$senha = trim($dados['senha'] ?? '');

//Valida os campos
if (empty($nome) || empty($senha)) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Preencha todos os campos!"]);
    exit();
}

//Busca e verificação do usuário
$stmt = $db->prepare("SELECT * FROM usuarios WHERE nome = :nome");
$stmt->execute([':nome' => $nome]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if ($usuario && password_verify($senha, $usuario['senha'])) {
    unset($usuario['senha']);
    
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Login realizado com sucesso!",
        "usuario" => $usuario
    ]);
} else {
    http_response_code(401);
    echo json_encode(["sucesso" => false, "mensagem" => "Nome ou senha incorretos."]);
}
?>