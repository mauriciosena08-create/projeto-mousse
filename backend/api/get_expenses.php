<?php
require_once __DIR__ . '/database.php';

try {
    //Consulta para listar todos os gastos junto com o nome do produto no estoque
    $sqlGastos = "SELECT 
                    gastos.id,
                    estoque.produto AS produto_nome,
                    gastos.quantidade,
                    gastos.valor,
                    gastos.data
                  FROM gastos
                  INNER JOIN estoque ON gastos.produto_id = estoque.id
                  ORDER BY gastos.id DESC";

    $stmtGastos = $db->query($sqlGastos);
    $listaGastos = $stmtGastos->fetchAll(PDO::FETCH_ASSOC);

    // Consulta para calcular a soma total de todos os valores gastos
    $sqlTotal = "SELECT SUM(valor) AS total_despesas FROM gastos";
    $stmtTotal = $db->query($sqlTotal);
    $resultadoTotal = $stmtTotal->fetch(PDO::FETCH_ASSOC);

    // Formata o valor total (se não tiver gasto, deixa como 0)
    $totalDespesas = floatval($resultadoTotal['total_despesas'] ?? 0);


    echo json_encode([
        "sucesso"        => true,
        "total_despesas" => $totalDespesas,
        "total_itens"    => count($listaGastos),
        "gastos"         => $listaGastos
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "sucesso"  => false,
        "mensagem" => "Erro ao calcular as despesas no banco de dados."
    ]);
}
?>