<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Função global para executar queries SQL no Turso via API HTTP
 */
function execute_turso_query($sql, $args = []) {
    $url = $_ENV['TURSO_DATABASE_URL'] ?? getenv('TURSO_DATABASE_URL');
    $authToken = $_ENV['TURSO_AUTH_TOKEN'] ?? getenv('TURSO_AUTH_TOKEN');

    if (!$url || !$authToken) {
        throw new Exception("Variáveis TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN não configuradas no Render.");
    }

    $httpUrl = str_replace("libsql://", "https://", $url) . "/v2/pipeline";

    $formattedArgs = array_map(function($arg) {
        if (is_null($arg)) return ["type" => "null"];
        if (is_int($arg)) return ["type" => "integer", "value" => (string)$arg];
        if (is_float($arg)) return ["type" => "float", "value" => $arg];
        return ["type" => "text", "value" => (string)$arg];
    }, $args);

    $payload = [
        "requests" => [
            [
                "type" => "execute",
                "stmt" => [
                    "sql" => $sql,
                    "args" => $formattedArgs
                ]
            ],
            ["type" => "close"]
        ]
    ];

    $ch = curl_init($httpUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $authToken,
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        throw new Exception("Erro cURL: " . curl_error($ch));
    }
    
    curl_close($ch);
    $data = json_decode($response, true);

    if (isset($data['results'][0]['response']['result'])) {
        return $data['results'][0]['response']['result'];
    }

    if (isset($data['results'][0]['error'])) {
        throw new Exception("Erro Turso: " . $data['results'][0]['error']['message']);
    }

    return null;
}

// Helper para converter linhas da API Turso em arrays associativos (estilo FETCH_ASSOC)
function turso_fetch_assoc($result) {
    if (!$result || empty($result['rows'])) return [];
    
    $cols = array_column($result['cols'], 'name');
    $rows = [];

    foreach ($result['rows'] as $row) {
        $item = [];
        foreach ($row as $index => $cell) {
            $item[$cols[$index]] = $cell['value'] ?? null;
        }
        $rows[] = $item;
    }

    return $rows;
}

try {
    // Tabela de Usuários
    execute_turso_query("CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        curso TEXT DEFAULT 'N/A',
        periodo TEXT DEFAULT 'N/A',
        tipo TEXT DEFAULT 'comprador'
    )");

    // Tabela de Estoque
    execute_turso_query("CREATE TABLE IF NOT EXISTS estoque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto TEXT NOT NULL,
        quantidade_disponivel INTEGER DEFAULT 0,
        imagem TEXT DEFAULT '',
        data TEXT
    )");

    try {
        execute_turso_query("ALTER TABLE estoque ADD COLUMN imagem TEXT DEFAULT ''");
    } catch (Exception $e) {}

    // Tabela de Pedidos
    execute_turso_query("CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente TEXT,
        itens TEXT,
        total REAL,
        status TEXT DEFAULT 'Pendente',
        data TEXT
    )");

    try {
        execute_turso_query("ALTER TABLE pedidos ADD COLUMN status TEXT DEFAULT 'Pendente'");
    } catch (Exception $e) {}

    // Tabela de Gastos / Despesas
    execute_turso_query("CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item TEXT NOT NULL,
        quantidade INTEGER,
        valor REAL,
        data TEXT,
        produto_id INTEGER
    )");

    // Administrador Padrão
    $res = execute_turso_query("SELECT COUNT(*) as total FROM usuarios WHERE nome = 'admininastro'");
    $total = $res['rows'][0][0]['value'] ?? 0;

    if ($total == 0) {
        $senhaHash = password_hash('maumau123', PASSWORD_DEFAULT);
        execute_turso_query(
            "INSERT INTO usuarios (nome, senha, curso, periodo, tipo) VALUES (?, ?, 'Gestão', 'N/A', 'admin')",
            ['admininastro', $senhaHash]
        );
    }

} catch (Exception $e) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code(500);
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Erro na inicialização do Turso: " . $e->getMessage()
    ]);
    exit();
}
?>
