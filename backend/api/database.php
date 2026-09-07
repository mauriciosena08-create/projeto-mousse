<?php
$dbPath = __DIR__ . '/database.sqlite';
$db = new PDO("sqlite:" . $dbPath);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Configurações de CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Criação das tabelas
$db->exec("CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE NOT NULL,
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
    item INTEGER NOT NULL,
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

// 2. Garante que existirá APENAS 1 Administrador Padrão
try {
    $stmtCheck = $db->query("SELECT COUNT(*) FROM usuarios WHERE tipo = 'admin'");
    $totalAdmins = $stmtCheck->fetchColumn();

    if ($totalAdmins == 0) {
        // Define nome e senha do admin padrão
        $adminNome = 'admininastro';
        $adminSenhaHash = password_hash('maumau123', PASSWORD_DEFAULT);

        $stmtInsertAdmin = $db->prepare("INSERT INTO usuarios (nome, senha, curso, periodo, tipo) VALUES (:nome, :senha, 'Gestão', 'N/A', 'admin')");
        $stmtInsertAdmin->execute([
            ':nome'  => $adminNome,
            ':senha' => $adminSenhaHash
        ]);
    }
} catch (PDOException $e) {
    // Ignora caso ocorra erro ao verificar no primeiro carregamento
}
?>
