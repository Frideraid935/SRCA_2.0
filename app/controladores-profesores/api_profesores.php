<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Indicar que la respuesta será JSON
header('Content-Type: application/json');

// Parámetros de conexión a la base de datos dockerizada
$servername = getenv('DB_HOST') ?: 'srca_db';
$username   = getenv('DB_USER') ?: 'root';
$password   = getenv('DB_PASS') ?: '1234';
$dbname     = getenv('DB_NAME') ?: 'srca';

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de conexión: ' . $conn->connect_error
    ]);
    exit;
}

// Leer datos JSON enviados desde el cliente
$data = json_decode(file_get_contents("php://input"), true);

$numeroControl = $data['numero_de_control'] ?? '';
$nombre = $data['nombre'] ?? '';
$especialidad = $data['especialidad'] ?? '';

// Validación básica
if (empty($numeroControl) || empty($nombre) || empty($especialidad)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Todos los campos son obligatorios'
    ]);
    exit;
}

// Verificar si ya existe el profesor
$stmtCheck = $conn->prepare("SELECT 1 FROM profesores WHERE numero_de_control = ?");
$stmtCheck->bind_param("s", $numeroControl);
$stmtCheck->execute();
$stmtCheck->store_result();

if ($stmtCheck->num_rows > 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Ya existe un profesor con este número de control'
    ]);
    $stmtCheck->close();
    $conn->close();
    exit;
}
$stmtCheck->close();

// Insertar nuevo profesor
$stmt = $conn->prepare("INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $numeroControl, $nombre, $especialidad);

if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Profesor registrado exitosamente'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al registrar profesor: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
