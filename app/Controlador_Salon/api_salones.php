<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Mostrar errores para desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Indicar que la respuesta será JSON
header('Content-Type: application/json');

// Conexión a la base de datos usando variables de entorno (para Docker)
$servername = getenv('DB_HOST') ?: 'srca_db';
$username   = getenv('DB_USER') ?: 'root';
$password   = getenv('DB_PASS') ?: '1234';
$dbname     = getenv('DB_NAME') ?: 'srca';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// Obtener los datos enviados por POST en JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validación básica
if (!isset($data['id'], $data['nombre'], $data['capacidad'], $data['profesor_id'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos."]);
    exit;
}

$id = (int) $data['id'];
$nombre = trim($data['nombre']);
$capacidad = (int) $data['capacidad'];
$profesor_id = trim($data['profesor_id']);

if ($id <= 0 || $capacidad <= 0 || empty($nombre) || empty($profesor_id)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios y numéricos positivos."]);
    exit;
}

// Verificar si el salón ya existe
$stmt_check = $conn->prepare("SELECT 1 FROM salones WHERE id = ?");
$stmt_check->bind_param("i", $id);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El ID del salón ya existe."]);
    $stmt_check->close();
    $conn->close();
    exit;
}
$stmt_check->close();

// Verificar si el profesor existe
$stmt_prof = $conn->prepare("SELECT 1 FROM profesores WHERE numero_de_control = ?");
$stmt_prof->bind_param("s", $profesor_id);
$stmt_prof->execute();
$stmt_prof->store_result();

if ($stmt_prof->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "El ID del profesor no existe."]);
    $stmt_prof->close();
    $conn->close();
    exit;
}
$stmt_prof->close();

// Insertar el nuevo salón
$stmt = $conn->prepare("INSERT INTO salones (id, nombre, capacidad, profesor_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isis", $id, $nombre, $capacidad, $profesor_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Salón registrado correctamente."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al registrar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
