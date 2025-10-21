<?php
header('Content-Type: application/json');

// Conexión usando variables de entorno de Railway
$servername = getenv("MYSQLHOST");
$username   = getenv("MYSQLUSER");
$password   = getenv("MYSQLPASSWORD");
$dbname     = getenv("MYSQLDATABASE");
$port       = getenv("MYSQLPORT") ?: 3306;

// Validar variables de entorno
if (!$servername || !$username || !$password || !$dbname) {
    echo json_encode([
        'error' => 'Faltan variables de entorno de Railway. 
        Asegúrate de haber configurado MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE y MYSQLPORT.'
    ]);
    exit;
}

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

$numeroControl = $_GET['numero_de_control'] ?? '';

if (empty($numeroControl)) {
    echo json_encode(['error' => 'Número de control no proporcionado']);
    exit;
}

// Verificar si el alumno existe
$sqlAlumno = "SELECT nombre FROM alumnos WHERE numero_de_control = ?";
$stmtAlumno = $conn->prepare($sqlAlumno);
$stmtAlumno->bind_param("s", $numeroControl);
$stmtAlumno->execute();
$resultAlumno = $stmtAlumno->get_result();

if ($resultAlumno->num_rows === 0) {
    echo json_encode(['error' => 'No se encontró un alumno con este número de control']);
    $stmtAlumno->close();
    $conn->close();
    exit;
}

$alumno = $resultAlumno->fetch_assoc();
$nombreAlumno = $alumno['nombre'];
$stmtAlumno->close();

// Consulta SQL para obtener las calificaciones
$sql = "SELECT 
            c.id, 
            m.nombre AS materia_nombre, 
            c.calificacion, 
            p.nombre AS profesor_nombre, 
            p.numero_de_control AS profesor_id
        FROM calificaciones c
        JOIN materias m ON c.materia_id = m.id
        JOIN profesores p ON c.profesor_id = p.numero_de_control
        WHERE c.numero_de_control = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $numeroControl);
$stmt->execute();
$result = $stmt->get_result();

$calificaciones = [];
while ($row = $result->fetch_assoc()) {
    $calificaciones[] = $row;
}

$response = [
    'estudiante' => $nombreAlumno . " (" . $numeroControl . ")",
    'calificaciones' => $calificaciones,
    'success' => true
];

echo json_encode($response);

$stmt->close();
$conn->close();
?>
