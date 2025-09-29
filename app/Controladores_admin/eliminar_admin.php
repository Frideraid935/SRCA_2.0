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

if (!$usuario) {
    echo json_encode(["status" => "error", "message" => "Usuario es obligatorio"]);
    exit;
}

// Primero verificamos que exista el admin
$sql_verificar = "SELECT usuario FROM administradores WHERE usuario = ?";
$stmt_verificar = $conn->prepare($sql_verificar);
$stmt_verificar->bind_param("s", $usuario);
$stmt_verificar->execute();
$stmt_verificar->store_result();

if ($stmt_verificar->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "El administrador no existe"]);
    exit;
}

// Procedemos a eliminar
$sql_eliminar = "DELETE FROM administradores WHERE usuario = ?";
$stmt_eliminar = $conn->prepare($sql_eliminar);
$stmt_eliminar->bind_param("s", $usuario);

if ($stmt_eliminar->execute()) {
    $respuesta = ["status" => "success", "message" => "Administrador eliminado correctamente"];
} else {
    $respuesta = ["status" => "error", "message" => "Error al eliminar: " . $stmt_eliminar->error];
}

$stmt_verificar->close();
$stmt_eliminar->close();
$conn->close();

echo json_encode($respuesta);
?>