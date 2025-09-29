<?php
// Mostrar errores para facilitar la depuración durante desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Establece que la respuesta será en formato JSON
header('Content-Type: application/json');

// Configuración de conexión a la base de datos
$servername = "localhost";     // Servidor local (por defecto en entornos locales)
$username = "root";            // Usuario por defecto de MySQL
$password = "1234";            // Contraseña del usuario
$dbname = "srca";              // Nombre de la base de datos

// Crear conexión usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hubo un error al conectar
if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión: " . $conn->connect_error
    ]);
    exit;
}

// Leer los datos enviados en formato JSON desde el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Validar que todos los campos requeridos estén presentes
if (
    !isset($data['id']) ||
    !isset($data['nombre']) ||
    !isset($data['capacidad']) ||
    !isset($data['profesor_id'])
) {
    echo json_encode([
        "status" => "error",
        "message" => "Datos incompletos."
    ]);
    exit;
}

// Asignar y limpiar valores recibidos
$id = (int) $data['id'];
$nombre = trim($data['nombre']);
$capacidad = (int) $data['capacidad'];
$profesor_id = trim($data['profesor_id']);

// Validar que ningún campo obligatorio esté vacío
if (empty($id) || empty($nombre) || empty($capacidad) || empty($profesor_id)) {
    echo json_encode([
        "status" => "error",
        "message" => "Todos los campos son obligatorios."
    ]);
    exit;
}

// Validar que ID y capacidad sean números positivos
if ($id <= 0 || $capacidad <= 0) {
    echo json_encode([
        "status" => "error",
        "message" => "ID y capacidad deben ser números positivos."
    ]);
    exit;
}

// Verificar si ya existe un salón con ese ID
$stmt_check = $conn->prepare("SELECT 1 FROM salones WHERE id = ?");
$stmt_check->bind_param("i", $id); // Vincula el ID como entero
$stmt_check->execute();             // Ejecuta la consulta
$stmt_check->store_result();        // Almacena el resultado para revisarlo

// Si ya hay un registro con ese ID
if ($stmt_check->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "El ID del salón ya existe."
    ]);
    $stmt_check->close();
    $conn->close();
    exit;
}
$stmt_check->close();

// Verificar si el profesor asignado existe en la tabla 'profesores'
$stmt_prof = $conn->prepare("SELECT 1 FROM profesores WHERE numero_de_control = ?");
$stmt_prof->bind_param("s", $profesor_id); // Vincula el ID del profesor como string
$stmt_prof->execute();                     // Ejecuta la consulta
$stmt_prof->store_result();                // Almacena el resultado

// Si no existe el profesor con ese número de control
if ($stmt_prof->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "El ID del profesor no existe."
    ]);
    $stmt_prof->close();
    $conn->close();
    exit;
}
$stmt_prof->close();

// Preparar consulta SQL para insertar el nuevo salón
$stmt = $conn->prepare("INSERT INTO salones (id, nombre, capacidad, profesor_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isis", $id, $nombre, $capacidad, $profesor_id); // Tipos: entero, cadena, entero, cadena

// Ejecutar la inserción
if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Salón registrado correctamente."
    ]);
} else {
    // En caso de fallo, devolver mensaje de error detallado
    echo json_encode([
        "status" => "error",
        "message" => "Error al registrar: " . $stmt->error
    ]);
}

// Cerrar recursos utilizados
$stmt->close();
$conn->close();
?>