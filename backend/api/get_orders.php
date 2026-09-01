<?php
require_once __DIR__ . '/database.php';

$pedidos = $db->query("SELECT * FROM pedidos WHERE status = 'pendente'")->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($pedidos);
