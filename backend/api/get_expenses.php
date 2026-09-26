<?php
require_once __DIR__ . '/database.php';

try {
    $sqlGastos = "SELECT 
                    gastos.id,
                    gastos.item AS produto_nome,
                    gastos.quantidade,
                    gastos.valor,
                    gastos.data
                  FROM gastos
                  ORDER BY gastos.id DESC";

    $resGastos = execute_turso_query($sqlGastos);
    $listaGastos = turso_fetch_assoc($resGastos);

    $sqlTotal = "SELECT SUM(valor) AS total_despesas FROM gastos";
    $resTotal = execute_turso_query($sqlTotal);
    $resultadoTotal = turso_fetch_assoc($resTotal);

    $totalDespesas = floatval($resultadoTotal[0]['total_despesas'] ?? 0);

    echo json_encode([
        "sucesso"        => true,
        "total_despesas" => $totalDespesas,
        "total_itens"    => count($listaGastos),
        "gastos"         => $listaGastos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "sucesso"  => false,
        "mensagem" => "Erro ao calcular as despesas no banco de dados."
    ]);
}
?>
