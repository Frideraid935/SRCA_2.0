<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===============================
// CONFIGURACIÓN DE CONEXIÓN A RAILWAY
// ===============================
$host     = getenv('MYSQLHOST');
$user     = getenv('MYSQLUSER');
$password = getenv('MYSQLPASSWORD');
$dbname   = getenv('MYSQLDATABASE');
$port     = getenv('MYSQLPORT') ?: 3306;

// ===============================
// VALIDAR VARIABLES DE ENTORNO
// ===============================
if (empty($host) || empty($user) || empty($password) || empty($dbname)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Faltan variables de entorno de Railway. Verifica MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE y MYSQLPORT.'
    ]);
    exit;
}

// ===============================
// CONEXIÓN A MYSQL (RAILWAY)
// ===============================
$conn = @new mysqli($host, $user, $password, $dbname, $port);

if ($conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de conexión con Railway: ' . $conn->connect_error,
        'host' => $host,
        'port' => $port
    ]);
    exit;
}

// ===============================
// LECTURA DE DATOS JSON
// ===============================
$data = json_decode(file_get_contents("php://input"), true);

$numeroControl = $data['numero_de_control'] ?? '';
$nombre = $data['nombre'] ?? '';
$especialidad = $data['especialidad'] ?? '';

// ===============================
// VALIDACIÓN DE CAMPOS
// ===============================
if (empty($numeroControl) || empty($nombre) || empty($especialidad)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Todos los campos son obligatorios'
    ]);
    exit;
}

// ===============================
// VERIFICAR SI YA EXISTE EL PROFESOR
// ===============================
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

// ===============================
// INSERTAR NUEVO PROFESOR
// ===============================
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
        'message' => 'Error al registrar profesor: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
