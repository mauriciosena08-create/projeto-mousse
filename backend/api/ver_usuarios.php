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

try {
    // Procura todos os utilizadores (omitindo a hash da senha por segurança)
    $res = execute_turso_query("SELECT id, nome, curso, periodo, tipo FROM usuarios ORDER BY id DESC");
    $usuarios = turso_fetch_assoc($res);

    echo json_encode([
        "sucesso" => true,
        "usuarios" => $usuarios
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao procurar utilizadores: " . $e->getMessage()
    ]);
}
?>
