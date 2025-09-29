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

$sql = "SELECT usuario FROM administradores WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Administrador no encontrado"]);
} else {
    $admin = $result->fetch_assoc();
    echo json_encode(["status" => "success", "admin" => $admin]);
}

$stmt->close();
$conn->close();
?>