<?php
// form.php - Process order creation
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get form data
    $orderData = [
        'order_id' => uniqid('ORD_'),
        'customer_name' => filter_var($_POST['nom'] ?? '', FILTER_SANITIZE_STRING),
        'customer_surname' => filter_var($_POST['cognom'] ?? '', FILTER_SANITIZE_STRING),
        'address' => filter_var($_POST['adresa'] ?? '', FILTER_SANITIZE_STRING),
        'email' => filter_var($_POST['correu'] ?? '', FILTER_SANITIZE_EMAIL),
        'phone' => filter_var($_POST['numTel'] ?? '', FILTER_SANITIZE_STRING),
        'items' => [],
        'timestamp' => date('Y-m-d H:i:s')
    ];

    // Validate required fields
    $requiredFields = ['customer_name', 'customer_surname', 'address', 'email', 'phone'];
    foreach ($requiredFields as $field) {
        if (empty($orderData[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate email format
    if (!filter_var($orderData['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Process items
    $prices = [
        'item1' => 29.99,
        'item2' => 49.99,
        'item3' => 19.99,
        'item4' => 79.99
    ];

    $subtotal = 0;
    $selectedItems = $_POST['items'] ?? [];

    foreach ($prices as $item => $price) {
        $quantityField = 'quantitatItem' . substr($item, -1);
        $quantity = isset($_POST[$quantityField]) ? intval($_POST[$quantityField]) : 0;
        
        if (in_array($item, $selectedItems) && $quantity > 0) {
            $itemTotal = $price * $quantity;
            $subtotal += $itemTotal;
            
            $orderData['items'][] = [
                'name' => $item,
                'price' => $price,
                'quantity' => $quantity,
                'total' => $itemTotal
            ];
        }
    }

    if (empty($orderData['items'])) {
        throw new Exception('No items selected with quantity > 0');
    }

    // Calculate totals
    $vat = $subtotal * 0.21;
    $total_with_vat = $subtotal + $vat;

    $orderData['subtotal'] = round($subtotal, 2);
    $orderData['vat'] = round($vat, 2);
    $orderData['total_with_vat'] = round($total_with_vat, 2);

    // Save order
    $result = saveOrder($orderData);
    
    if (!$result) {
        throw new Exception('Failed to save order');
    }

    // Success response
    echo json_encode([
        'success' => true,
        'order_id' => $orderData['order_id'],
        'total_with_vat' => number_format($total_with_vat, 2),
        'message' => 'Order created successfully'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

function saveOrder($orderData) {
    $ordersFile = __DIR__ . '/../../onlineOrders/onlineOrders.db';
    
    // Create directory if it doesn't exist
    $ordersDir = dirname($ordersFile);
    if (!is_dir($ordersDir)) {
        mkdir($ordersDir, 0755, true);
    }
    
    // Read existing orders
    $orders = [];
    if (file_exists($ordersFile)) {
        $content = file_get_contents($ordersFile);
        if (!empty($content)) {
            $orders = unserialize($content);
        }
    }
    
    // Add new order
    $orders[$orderData['order_id']] = $orderData;
    
    // Save to file
    return file_put_contents($ordersFile, serialize($orders)) !== false;
}
?>