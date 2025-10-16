<?php
// search_order.php - Search for specific order
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$orderId = $_POST['order_id'] ?? '';

if (empty($orderId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required']);
    exit;
}

$ordersFile = __DIR__ . '/../../onlineOrders/onlineOrders.db';
$orders = [];

if (file_exists($ordersFile)) {
    $existingData = file_get_contents($ordersFile);
    if (!empty($existingData)) {
        $orders = unserialize($existingData);
        if (!is_array($orders)) {
            $orders = [];
        }
    }
}

if (isset($orders[$orderId])) {
    echo json_encode([
        'success' => true,
        'order' => $orders[$orderId]
    ]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Order not found']);
}
?>