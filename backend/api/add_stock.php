<?php
// Cabeçalhos CORS no topo do arquivo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Resposta para pré-checagem OPTIONS do navegador
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ob_start();
error_reporting(0);
ini_set('display_errors', 0);

require_once __DIR__ . '/database.php';
ob_clean();

$data = json_decode(file_get_contents("php://input"), true);

$produto = trim($data['produto'] ?? '');
$quantidade = intval($data['quantidade'] ?? 0);

if (empty($produto) || $quantidade <= 0) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe um produto e uma quantidade válida."]);
    exit;
}

try {
    // Consulta se o produto já existe para somar a quantidade
    $stmtCheck = $db->prepare("SELECT id, quantidade_disponivel FROM estoque WHERE produto = :produto");
    $stmtCheck->execute([':produto' => $produto]);
    $itemExistente = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    $dataAtual = date('Y-m-d H:i:s');

    if ($itemExistente) {
        $novaQtd = $itemExistente['quantidade_disponivel'] + $quantidade;
        $stmtUpdate = $db->prepare("UPDATE estoque SET quantidade_disponivel = :qtd, data = :data WHERE id = :id");
        $stmtUpdate->execute([
            ':qtd' => $novaQtd,
            ':data' => $dataAtual,
            ':id' => $itemExistente['id']
        ]);
    } else {
        $stmtInsert = $db->prepare("INSERT INTO estoque (produto, quantidade_disponivel, data) VALUES (:produto, :quantidade, :data)");
        $stmtInsert->execute([
            ':produto' => $produto,
            ':quantidade' => $quantidade,
            ':data' => $dataAtual
        ]);
    }

    echo json_encode(["sucesso" => true, "mensagem" => "Estoque atualizado com sucesso!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro no banco: " . $e->getMessage()]);
}
?>
