<?php
// Configurações de CORS para permitir a visualização
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Inclui a sua conexão com o SQLite
require_once "database.php"; 

try {
    // Consulta todos os registros da tabela usuarios
    $stmt = $pdo->query("SELECT id, nome, curso, periodo FROM usuarios");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Exibe os dados em formato JSON organizado
    echo json_encode([
        "status" => "sucesso",
        "total" => count($usuarios),
        "dados" => $usuarios
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "erro",
        "mensagem" => $e->getMessage()
    ]);
}
?>
