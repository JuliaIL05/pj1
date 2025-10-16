<?php
// view_orders.php - Display all orders
header('Content-Type: text/html; charset=UTF-8');

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

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Orders - Julia & Tech</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
        }
        .order {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .order-header {
            font-weight: bold;
            color: #834a51;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        .button {
            background-color: #834a51;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 5px;
        }
        .no-orders {
            text-align: center;
            color: #666;
            font-size: 18px;
            margin: 50px 0;
        }
    </style>
</head>
<body>
    <h1>All Orders - Julia & Tech</h1>
    
    <?php if (empty($orders)): ?>
        <div class="no-orders">No orders found</div>
    <?php else: ?>
        <?php foreach ($orders as $orderId => $order): ?>
            <div class="order">
                <div class="order-header">
                    Order ID: <?php echo htmlspecialchars($orderId); ?> | 
                    Customer: <?php echo htmlspecialchars($order['customer_name'] . ' ' . $order['customer_surname']); ?> |
                    Date: <?php echo htmlspecialchars($order['timestamp']); ?>
                </div>
                <div>
                    <strong>Contact:</strong> 
                    <?php echo htmlspecialchars($order['email']); ?> | 
                    <?php echo htmlspecialchars($order['phone']); ?>
                </div>
                <div>
                    <strong>Address:</strong> <?php echo htmlspecialchars($order['address']); ?>
                </div>
                <div>
                    <strong>Items:</strong>
                    <ul>
                        <?php foreach ($order['items'] as $item): ?>
                            <li>
                                <?php echo htmlspecialchars($item['name']); ?>: 
                                <?php echo $item['quantity']; ?> x 
                                €<?php echo number_format($item['price'], 2); ?> = 
                                €<?php echo number_format($item['total'], 2); ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div>
                    <strong>Total with VAT (21%):</strong> 
                    €<?php echo number_format($order['total_with_vat'], 2); ?>
                </div>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
    
    <div style="margin-top: 20px;">
        <a href="../cli/menu.html" class="button">Back to Operations Menu</a>
        <a href="../cli/index.html" class="button">Back to Main Page</a>
    </div>
</body>
</html>