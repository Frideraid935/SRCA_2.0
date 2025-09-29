<?php
header('Content-Type: application/json');

// Configuración de la conexión a la base de datos RF_03
$servername = "localhost";
$username = "root"; // Cambia esto según tu configuración
$password = "1234"; // Cambia esto según tu configuración
$dbname = "srca"; // Cambia esto según tu configuración

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// Consultar todos los alumnos
$sql = "SELECT id, nombre, fecha_nacimiento, numero_de_control FROM alumnos";
$resultado = $conn->query($sql);

if ($resultado->num_rows > 0) {
    $alumnos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $alumnos[] = $fila;
    }
    echo json_encode($alumnos);
} else {
    echo json_encode([]);
}

$conn->close();
?>