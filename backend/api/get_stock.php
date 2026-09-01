<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/database.php';

try {
    // garante que a tabela estoque exista antes de consultar
    $db->exec("CREATE TABLE IF NOT EXISTS estoque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto TEXT NOT NULL UNIQUE,
        quantidade INTEGER NOT NULL DEFAULT 0
    )");

    //busca todos os produtos do estoque
    $stmt = $db->query("SELECT * FROM estoque ORDER BY produto ASC");
    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //retorna a lista de produtos em formato JSON
    echo json_encode([
        "sucesso" => true,
        "total_produtos" => count($produtos),
        "produtos" => $produtos
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao buscar produtos no estoque: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>