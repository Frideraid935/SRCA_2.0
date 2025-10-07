<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===== DETECTAR ENTORNO =====
$isRailway = getenv('MYSQLHOST') !== false; // Si existe MYSQLHOST, estamos en Railway

if ($isRailway) {
    // 🌐 Configuración para Railway
    $servername = getenv('MYSQLHOST');
    $username   = getenv('MYSQLUSER');
    $password   = getenv('MYSQLPASSWORD');
    $dbname     = getenv('MYSQLDATABASE');
    $port       = getenv('MYSQLPORT') ?: 3306;
} else {
    // 🐳 Configuración para Docker local
    $servername = getenv('DB_HOST') ?: 'srca_db';
    $username   = getenv('DB_USER') ?: 'root';
    $password   = getenv('DB_PASS') ?: '1234';
    $dbname     = getenv('DB_NAME') ?: 'srca';
    $port       = getenv('DB_PORT') ?: 3306;
}

// ===== CREAR CONEXIÓN =====
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// ===== VERIFICAR CONEXIÓN =====
if ($conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de conexión: ' . $conn->connect_error,
        'host' => $servername
    ]);
    exit;
}

// ===== LECTURA DEL JSON =====
$data = json_decode(file_get_contents("php://input"), true);

$numeroControl = $data['numero_de_control'] ?? '';
$nombre = $data['nombre'] ?? '';
$especialidad = $data['especialidad'] ?? '';

// ===== VALIDACIÓN BÁSICA =====
if (empty($numeroControl) || empty($nombre) || empty($especialidad)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Todos los campos son obligatorios'
    ]);
    exit;
}

// ===== VERIFICAR SI YA EXISTE =====
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

// ===== INSERTAR NUEVO PROFESOR =====
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
