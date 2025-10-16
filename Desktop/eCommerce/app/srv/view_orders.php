<?php
$file = 'informacion.bd';
$orders = [];

if (file_exists($file)) {
    $orders = json_decode(file_get_contents($file), true);
    if (!is_array($orders)) {
        $orders = [];
    }
} else {
    echo "No orders found.";
    exit;
}

?>
