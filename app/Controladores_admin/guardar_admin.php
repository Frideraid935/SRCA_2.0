<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "srca";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$usuario = $data['usuario'] ?? null;
$contrasena = $data['contrasena'] ?? null;

if (!$usuario || !$contrasena) {
    echo json_encode(["status" => "error", "message" => "Usuario y contraseña son obligatorios."]);
    exit;
}

// Verificar si el usuario ya existe
$sql_verificar = "SELECT usuario FROM administradores WHERE usuario = ?";
$stmt_verificar = $conn->prepare($sql_verificar);
$stmt_verificar->bind_param("s", $usuario);
$stmt_verificar->execute();
$stmt_verificar->store_result();

if ($stmt_verificar->num_rows > 0) {
    $stmt_verificar->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "El nombre de usuario ya está en uso"]);
    exit;
}

// MODIFICACIÓN PRINCIPAL: Almacenar contraseña en texto plano (NO RECOMENDADO)
$sql_insertar = "INSERT INTO administradores (usuario, contrasena) VALUES (?, ?)";
$stmt_insertar = $conn->prepare($sql_insertar);
$stmt_insertar->bind_param("ss", $usuario, $contrasena); // Aquí se envía la contraseña sin hashear

if ($stmt_insertar->execute()) {
    $respuesta = ["status" => "success", "message" => "Administrador registrado exitosamente"];
} else {
    $respuesta = ["status" => "error", "message" => "Error al registrar el administrador: " . $stmt_insertar->error];
}

$stmt_verificar->close();
$stmt_insertar->close();
$conn->close();

echo json_encode($respuesta);
?>