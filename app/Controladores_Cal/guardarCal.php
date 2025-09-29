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

// Verificar si se recibieron datos por POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

// Recibir datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

// Si no se recibió JSON, intentar con POST normal
if (json_last_error() !== JSON_ERROR_NONE) {
    $data = $_POST;
}

// Asignar valores con operador ternario seguro
$alumno_nombre = $data['alumno_nombre_ingresar'] ?? '';
$numero_de_control = $data['numero_de_control_ingresar'] ?? '';
$materia_id = $data['materia_id_ingresar'] ?? 0;
$calificacion = $data['calificacion_ingresar'] ?? 0.0;
$profesor_nombre = $data['profesor_nombre_ingresar'] ?? '';

// Validaciones básicas
$errors = [];

if (empty($alumno_nombre)) {
    $errors[] = "El nombre del alumno es requerido";
}

if (empty($numero_de_control) || strlen($numero_de_control) != 8) {
    $errors[] = "Número de control inválido (debe tener 8 caracteres)";
}

if ($materia_id <= 0) {
    $errors[] = "ID de materia inválido";
}

if ($calificacion < 0 || $calificacion > 10) {
    $errors[] = "La calificación debe estar entre 0 y 10";
}

if (empty($profesor_nombre)) {
    $errors[] = "El nombre del profesor es requerido";
}

if (!empty($errors)) {
    echo json_encode(["status" => "error", "message" => implode("<br>", $errors)]);
    exit;
}

// Verificar existencia de registros relacionados
function verificarExistencia($conn, $query, $params, $types, $errorMsg) {
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    return $result->num_rows > 0 ? true : $errorMsg;
}

// Verificar alumno
$alumnoExiste = verificarExistencia(
    $conn,
    "SELECT id FROM alumnos WHERE numero_de_control = ?",
    [$numero_de_control],
    "s",
    "El alumno no existe"
);

if ($alumnoExiste !== true) {
    echo json_encode(["status" => "error", "message" => $alumnoExiste]);
    exit;
}

// Verificar materia
$materiaExiste = verificarExistencia(
    $conn,
    "SELECT id FROM materias WHERE id = ?",
    [$materia_id],
    "i",
    "La materia no existe"
);

if ($materiaExiste !== true) {
    echo json_encode(["status" => "error", "message" => $materiaExiste]);
    exit;
}

// Obtener ID del profesor
$stmt_profesor = $conn->prepare("SELECT numero_de_control FROM profesores WHERE nombre = ?");
$stmt_profesor->bind_param("s", $profesor_nombre);
$stmt_profesor->execute();
$result_profesor = $stmt_profesor->get_result();

if ($result_profesor->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "El profesor no existe"]);
    $stmt_profesor->close();
    exit;
}

$profesor_data = $result_profesor->fetch_assoc();
$profesor_id = $profesor_data['numero_de_control'];
$stmt_profesor->close();

// Insertar la calificación
$sql_insert = "INSERT INTO calificaciones (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id) 
               VALUES (?, ?, ?, ?, ?)";

$stmt_insert = $conn->prepare($sql_insert);

// Asegurar tipos correctos
$materia_id = (int)$materia_id;
$calificacion = (float)$calificacion;

$stmt_insert->bind_param("ssids", $alumno_nombre, $numero_de_control, $materia_id, $calificacion, $profesor_id);

if ($stmt_insert->execute()) {
    echo json_encode([
        "status" => "success", 
        "message" => "Calificación registrada exitosamente",
        "insert_id" => $stmt_insert->insert_id
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Error al registrar calificación: " . $stmt_insert->error,
        "error_details" => $conn->error
    ]);
}

$stmt_insert->close();
$conn->close();
?>