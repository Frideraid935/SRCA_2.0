<?php
// Establece el tipo de contenido como JSON para la respuesta HTTP
header('Content-Type: application/json');

// Configuración de los parámetros de conexión a la base de datos
$servername = "localhost";     // Nombre del servidor de la base de datos
$username = "root";            // Usuario de la base de datos
$password = "1234";            // Contraseña del usuario
$dbname = "srca";              // Nombre de la base de datos

// Crear conexión usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hubo un error en la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]));
}

// Obtener los datos enviados por método POST
// Si no existen, se asignan valores vacíos por defecto
$numeroControl = $_POST['numero_de_control'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$especialidad = $_POST['especialidad'] ?? '';

// Validación: Todos los campos son obligatorios
if (empty($numeroControl) || empty($nombre) || empty($especialidad)) {
    echo json_encode(['error' => 'Todos los campos son obligatorios']);
    exit;
}

// Preparar consulta SQL para verificar si ya existe un profesor con ese número de control
$sqlCheck = "SELECT * FROM profesores WHERE numero_de_control = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("s", $numeroControl); // Vincular como string
$stmtCheck->execute();                       // Ejecutar consulta
$resultCheck = $stmtCheck->get_result();     // Obtener resultados

// Si ya existe un profesor con ese número de control
if ($resultCheck->num_rows > 0) {
    echo json_encode(['error' => 'Ya existe un profesor con este número de control']);
    exit;
}

// Preparar consulta SQL para insertar un nuevo profesor
$sql = "INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

// Vincular parámetros: número de control, nombre y especialidad
$stmt->bind_param("sss", $numeroControl, $nombre, $especialidad);

// Ejecutar la inserción
if ($stmt->execute()) {
    // Si fue exitosa, devolver mensaje de éxito
    echo json_encode([
        'success' => true,
        'message' => 'Profesor registrado exitosamente'
    ]);
} else {
    // Si hubo un error al insertar, devolver mensaje detallado
    echo json_encode(['error' => 'Error al registrar el profesor: ' . $conn->error]);
}

// Cerrar la conexión con la base de datos
$conn->close();
?>