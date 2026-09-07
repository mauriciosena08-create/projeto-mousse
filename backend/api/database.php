<?php
// Permite que qualquer origem acesse a API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Trata requisições OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dbPath = __DIR__ . '/banco.sqlite';

try {
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Tabela de Usuários
    $db->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        curso TEXT DEFAULT 'N/A',
        periodo TEXT DEFAULT 'N/A',
        tipo TEXT DEFAULT 'comprador'
    )");

    // Tabela de Estoque
    $db->exec("CREATE TABLE IF NOT EXISTS estoque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto TEXT NOT NULL,
        quantidade_disponivel INTEGER DEFAULT 0,
        data TEXT
    )");

    // Tabela de Pedidos
    $db->exec("CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente TEXT,
        itens TEXT,
        total REAL,
        data TEXT
    )");

    // Cria o Administrador Padrão 'admininastro' se não existir
    $stmtCheck = $db->prepare("SELECT COUNT(*) FROM usuarios WHERE nome = 'admininastro'");
    $stmtCheck->execute();
    if ($stmtCheck->fetchColumn() == 0) {
        $stmtInsertAdmin = $db->prepare("INSERT INTO usuarios (nome, senha, curso, periodo, tipo) VALUES (:nome, :senha, 'Gestão', 'N/A', 'admin')");
        $stmtInsertAdmin->execute([
            ':nome'  => 'admininastro',
            ':senha' => password_hash('maumau123', PASSWORD_DEFAULT)
        ]);
    }

} catch (PDOException $e) {
    // Retorna resposta JSON amigável e tratada em caso de falha no SQLite
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code(500);
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Erro na conexão do banco de dados: " . $e->getMessage()
    ]);
    exit();
}
?>
