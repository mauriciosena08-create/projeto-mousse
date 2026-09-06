<?php
// Exemplo de conexão utilizando caminho absoluto dentro do container Docker
$dbPath = __DIR__ . '/database.sqlite'; // Ou o nome exato do seu arquivo .db / .sqlite
$db = new PDO("sqlite:" . $dbPath);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// 2. Liberamos o acesso para o React conseguir conversar com o PHP sem bloqueios no navegador (CORS)
//Não sei como isso funciona, pedi para o gemini criar pois não entendo de react
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$db->exec("CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    curso TEXT NOT NULL,
    periodo TEXT NOT NULL,
    tipo TEXT DEFAULT 'comprador'
)");
$db->exec("CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    status TEXT DEFAULT 'Pendente',
    data TEXT NOT NULL
)");
$db->exec("CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL,
    quantidade TEXT NOT NULL,
    valor REAL NOT NULL,
    data TEXT NOT NULL
)");
$db->exec("CREATE TABLE IF NOT EXISTS estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto TEXT UNIQUE NOT NULL,
    quantidade_disponivel INTEGER NOT NULL,
    data TEXT NOT NULL
)");
?>
