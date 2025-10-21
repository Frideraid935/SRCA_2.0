<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===============================
// DETECTAR ENTORNO (RAILWAY O DOCKER)
// ===============================
$env = getenv('RAILWAY_ENVIRONMENT') ? 'railway' : 'docker';

if ($env === 'railway') {
    // 🌐 Configuración Railway
    $host     = getenv('MYSQLHOST');
    $user     = getenv('MYSQLUSER');
    $password = getenv('MYSQLPASSWORD');
    $dbname   = getenv('MYSQLDATABASE');
    $port     = getenv('MYSQLPORT') ?: 3306;
} else {
    // 🐳 Configuración Docker local
    $host     = getenv('DB_HOST') ?: 'srca_db';
    $user     = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '1234';
    $dbname   = getenv('DB_NAME') ?: 'srca';
    $port     = getenv('DB_PORT') ?: 3306;
}

// ===============================
// CREAR CONEXIÓN
// ===============================
$conn = @new mysqli($host, $user, $password, $dbname, $port);

// ===============================
// VERIFICAR CONEXIÓN
// ===============================
if ($conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => ' Error de conexión con la base de datos',
        'detalles' => $conn->connect_error,
        'host' => $host,
        'puerto' => $port,
        'entorno' => $env
    ]);
    exit;
}

// ===============================
// LEER JSON DE ENTRADA
// ===============================
$data = json_decode(file_get_contents("php://input"), true);

$numeroControl = $data['numero_de_control'] ?? '';
$nombre = $data['nombre'] ?? '';
$especialidad = $data['especialidad'] ?? '';

// ===============================
// VALIDAR CAMPOS
// ===============================
if (empty($numeroControl) || empty($nombre) || empty($especialidad)) {
    echo json_encode([
        'status' => 'error',
        'message' => ' Todos los campos son obligatorios'
    ]);
    exit;
}

// ===============================
// VERIFICAR SI YA EXISTE
// ===============================
$stmtCheck = $conn->prepare("SELECT 1 FROM profesores WHERE numero_de_control = ?");
$stmtCheck->bind_param("s", $numeroControl);
$stmtCheck->execute();
$stmtCheck->store_result();

if ($stmtCheck->num_rows > 0) {
    echo json_encode([
        'status' => 'error',
        'message' => ' Ya existe un profesor con este número de control'
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
        'message' => 'Error al registrar profesor',
        'detalle' => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
