<?php
// ===============================
// RF_03 - Buscar alumno por número de control
// ===============================
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===============================
// CONFIGURACIÓN DE RAILWAY
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
        "status" => "error",
        "message" => "Faltan variables de entorno de Railway. 
        Asegúrate de haber configurado MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE y MYSQLPORT."
    ]);
    exit;
}

// ===============================
// CONEXIÓN A LA BASE DE DATOS (RAILWAY)
// ===============================
$conn = @new mysqli($host, $user, $password, $dbname, $port);

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión con Railway: " . $conn->connect_error,
        "host" => $host,
        "port" => $port
    ]);
    exit;
}

// ===============================
// LECTURA DEL JSON RECIBIDO
// ===============================
$data = json_decode(file_get_contents("php://input"), true);
$numero_de_control = $data['numero_de_control'] ?? null;

// ===============================
// VALIDACIÓN DE ENTRADA
// ===============================
if (!$numero_de_control) {
    echo json_encode([
        "status" => "error",
        "message" => "Número de control no proporcionado."
    ]);
    $conn->close();
    exit;
}

// ===============================
// CONSULTA PARA BUSCAR AL ALUMNO
// ===============================
$sql_buscar = "SELECT * FROM alumnos WHERE numero_de_control = ?";
$stmt_buscar = $conn->prepare($sql_buscar);
$stmt_buscar->bind_param("s", $numero_de_control);
$stmt_buscar->execute();
$resultado = $stmt_buscar->get_result();

// ===============================
// RESPUESTA DEL SERVICIO
// ===============================
if ($resultado->num_rows > 0) {
    $alumno = $resultado->fetch_assoc();
    echo json_encode([
        "status" => "success",
        "message" => "Alumno encontrado.",
        "data" => $alumno
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se encontró ningún alumno con ese número de control."
    ]);
}

// ===============================
// LIMPIEZA FINAL
// ===============================
$stmt_buscar->close();
$conn->close();
?>
