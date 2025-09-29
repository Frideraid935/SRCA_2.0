<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$host = "localhost";
$user = "root";
$password = "1234";
$dbname = "crud";

// Crear conexión
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// Consultar datos de alumnos
$sql = "SELECT id, nombre, fecha_nacimiento, numero_de_control FROM alumnos";
$result = $conn->query($sql);

$alumnos = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $alumnos[] = $row;
    }
}

echo json_encode($alumnos);
$conn->close();
?>
