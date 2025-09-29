<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "srca";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

// Obtener datos del request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Si no llega como JSON, intentar con POST normal
if (json_last_error() !== JSON_ERROR_NONE) {
    $data = $_POST;
}

// Validar que se recibieron datos
if ($data === null) {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos válidos"]);
    exit;
}

// Validar datos requeridos
$requiredFields = ['id', 'alumno_nombre', 'numero_de_control', 'materia_id', 'calificacion', 'profesor_id'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["status" => "error", "message" => "El campo $field es requerido"]);
        exit;
    }
}

// Asignar y validar datos
$id = (int)$data['id'];
$alumno_nombre = trim($data['alumno_nombre']);
$numero_de_control = trim($data['numero_de_control']);
$materia_id = (int)$data['materia_id'];
$calificacion = (float)$data['calificacion'];
$profesor_id = trim($data['profesor_id']);

// Validaciones
if (empty($alumno_nombre) || empty($numero_de_control) || empty($profesor_id)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son requeridos"]);
    exit;
}

if (strlen($numero_de_control) !== 8) {
    echo json_encode(["status" => "error", "message" => "Número de control debe tener 8 caracteres"]);
    exit;
}

if ($calificacion < 0 || $calificacion > 10) {
    echo json_encode(["status" => "error", "message" => "Calificación debe estar entre 0 y 10"]);
    exit;
}

// Verificar existencia de registros relacionados
$checkQueries = [
    "alumno" => ["SELECT id FROM alumnos WHERE numero_de_control = ?", "s", $numero_de_control],
    "materia" => ["SELECT id FROM materias WHERE id = ?", "i", $materia_id],
    "profesor" => ["SELECT numero_de_control FROM profesores WHERE numero_de_control = ?", "s", $profesor_id]
];

foreach ($checkQueries as $key => $query) {
    $stmt = $conn->prepare($query[0]);
    $stmt->bind_param($query[1], $query[2]);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => ucfirst($key) . " no encontrado"]);
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();
}

// Actualizar la calificación
$sql = "UPDATE calificaciones SET 
        alumno_nombre = ?,
        numero_de_control = ?,
        materia_id = ?,
        calificacion = ?,
        profesor_id = ?,
        fecha_actualizacion = NOW()
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssidsi", $alumno_nombre, $numero_de_control, $materia_id, $calificacion, $profesor_id, $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Calificación actualizada correctamente"]);
    } else {
        echo json_encode(["status" => "info", "message" => "No se realizaron cambios"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>