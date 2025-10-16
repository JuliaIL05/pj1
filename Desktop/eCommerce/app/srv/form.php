<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    echo "Access denied.";
    exit;
}

// Neteja la funcio
function clean($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Neteja els inputs 
$firstName = clean($_POST['nom'] ?? '');
$lastName = clean($_POST['cognom'] ?? '');
$address = clean($_POST['adresa'] ?? '');
$email = filter_var($_POST['correu'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = clean($_POST['numTel'] ?? '');

// Es mostra l'input a la pantalla
$output = "<h2>Submitted Information:</h2>";
$output .= "<p><strong>First Name:</strong> $firstName</p>";
$output .= "<p><strong>Last Name:</strong> $lastName</p>";
$output .= "<p><strong>Address:</strong> $address</p>";
$output .= "<p><strong>Email:</strong> $email</p>";
$output .= "<p><strong>Phone:</strong> $phone</p>";

// Afegeix ID als items
$availableProducts = [
    "item1" => "Lenovo Legion 7 16IAX10 Laptop",
    "item2" => "ASUS Dual Radeon RX 9060 XT",
    "item3" => "Logitech Pro X Superlight",
    "item4" => "Alurin CoreVision Monitor"
];

$output .= "<h3>Selected Products:</h3>";

if (!empty($_POST['productos']) && is_array($_POST['productos'])) {
    $output .= "<ul>";
    foreach ($_POST['productos'] as $code => $product) {
        $isChecked = isset($product['checked']);
        $quantity = isset($product['cantidad']) ? (int)$product['cantidad'] : 0;

        if ($isChecked && $quantity > 0) {
            $productName = $availableProducts[$code] ?? "Unknown product";
            $output .= "<li>$productName - Quantity: $quantity</li>";
        }
    }
    $output .= "</ul>";
} else {
    $output .= "<p>No products were selected.</p>";
}

echo $output;
?>
