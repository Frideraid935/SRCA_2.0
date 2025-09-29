<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "srca";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]));
}

$numeroControl = isset($_GET['numero_de_control']) ? $_GET['numero_de_control'] : '';

if (empty($numeroControl)) {
    echo json_encode(['error' => 'Número de control no proporcionado']);
    exit;
}

// Primero verificamos si el alumno existe
$sqlAlumno = "SELECT nombre FROM alumnos WHERE numero_de_control = ?";
$stmtAlumno = $conn->prepare($sqlAlumno);
$stmtAlumno->bind_param("s", $numeroControl);
$stmtAlumno->execute();
$resultAlumno = $stmtAlumno->get_result();

if ($resultAlumno->num_rows === 0) {
    echo json_encode(['error' => 'No se encontró un alumno con este número de control']);
    exit;
}

$alumno = $resultAlumno->fetch_assoc();
$nombreAlumno = $alumno['nombre'];

// Consulta SQL para obtener las calificaciones del alumno
$sql = "SELECT c.id, m.nombre AS materia_nombre, c.calificacion, 
               p.nombre AS profesor_nombre, p.numero_de_control AS profesor_id
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

// Organizar los datos para la respuesta
$response = [
    'estudiante' => $nombreAlumno . " (" . $numeroControl . ")",
    'calificaciones' => $calificaciones,
    'success' => true
];

echo json_encode($response);

$conn->close();
?>