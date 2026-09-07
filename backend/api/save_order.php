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
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/database.php';
ob_clean();

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Dados inválidos recebidos."]);
    exit();
}

try {
    $cliente = $data['cliente'] ?? $data['usuario_id'] ?? 'Anônimo';
    $itensArray = $data['itens'] ?? [];
    $itensJson = json_encode($itensArray);
    $total = $data['total'] ?? 0;
    $dataHora = date('Y-m-d H:i:s');

    // Registra log para acompanhamento
    file_put_contents(__DIR__ . '/debug_estoque.log', date('[Y-m-d H:i:s] ') . "PAYLOAD: " . $input . PHP_EOL, FILE_APPEND);

    // 1. Grava o pedido
    $stmt = $db->prepare("INSERT INTO pedidos (cliente, itens, total, data) VALUES (:cliente, :itens, :total, :data)");
    $stmt->execute([
        ':cliente' => $cliente,
        ':itens'   => $itensJson,
        ':total'   => $total,
        ':data'    => $dataHora
    ]);

    // 2. Atualiza cada item no estoque
    if (is_array($itensArray)) {
        foreach ($itensArray as $item) {
            $nomeProduto = trim($item['produto'] ?? $item['nome'] ?? '');
            $qtdComprada = (int)($item['quantidade'] ?? $item['quant'] ?? 1);
            $idProduto = $item['id'] ?? $item['produto_id'] ?? null;

            if ($qtdComprada <= 0) continue;

            $afetados = 0;

            // Tentativa 1: Atualiza pelo ID (mais seguro)
            if ($idProduto) {
                $stmtId = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE id = :id");
                $stmtId->execute([':qtd' => $qtdComprada, ':id' => $idProduto]);
                $afetados = $stmtId->rowCount();
            }

            // Tentativa 2: Atualiza por comparação flexível de nome (LIKE)
            if ($afetados === 0 && !empty($nomeProduto)) {
                $stmtNome = $db->prepare("UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - :qtd WHERE produto LIKE :produto OR nome LIKE :produto");
                $stmtNome->execute([':qtd' => $qtdComprada, ':produto' => '%' . $nomeProduto . '%']);
                $afetados = $stmtNome->rowCount();
            }

            // Tentativa 3: Se a coluna no SQLite se chamar 'quantidade' em vez de 'quantidade_disponivel'
            if ($afetados === 0) {
                $stmtAlt = $db->prepare("UPDATE estoque SET quantidade = quantidade - :qtd WHERE produto LIKE :produto OR nome LIKE :produto");
                $stmtAlt->execute([':qtd' => $qtdComprada, ':produto' => '%' . $nomeProduto . '%']);
                $afetados = $stmtAlt->rowCount();
            }

            // Loga no arquivo o resultado da atualização
            file_put_contents(__DIR__ . '/debug_estoque.log', date('[Y-m-d H:i:s] ') . "Item: {$nomeProduto} | Qtd: {$qtdComprada} | Linhas afetadas: {$afetados}" . PHP_EOL, FILE_APPEND);
        }
    }

    echo json_encode(["sucesso" => true, "mensagem" => "Pedido realizado com sucesso!"]);
} catch (Exception $e) {
    file_put_contents(__DIR__ . '/debug_estoque.log', date('[Y-m-d H:i:s] ') . "ERRO: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Erro no servidor: " . $e->getMessage()]);
}
?>
