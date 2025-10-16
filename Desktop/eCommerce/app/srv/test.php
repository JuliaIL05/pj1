<?php
// test.php - Archivo de prueba simple
header('Content-Type: application/json');

// Respuesta simple de prueba
echo json_encode([
    'success' => true,
    'message' => 'PHP funcionando correctamente',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>