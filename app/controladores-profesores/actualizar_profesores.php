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
    // Devuelve mensaje de error en formato JSON y termina la ejecución
    die(json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]));
}

// Obtener los datos enviados por método POST
// Si no existen, se asignan cadenas vacías por defecto
$numeroOriginal = $_POST['numero_original'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$especialidad = $_POST['especialidad'] ?? '';

// Validación: Todos los campos son obligatorios
if (empty($numeroOriginal) || empty($nombre) || empty($especialidad)) {
    echo json_encode(['error' => 'Todos los campos son obligatorios']);
    exit;
}

// Preparar consulta SQL para actualizar los datos del profesor
$sql = "UPDATE profesores SET nombre = ?, especialidad = ? WHERE numero_de_control = ?";
$stmt = $conn->prepare($sql);

// Vincular los parámetros en orden:
// - nombre (string), 
// - especialidad (string), 
// - numero_de_control (string)
$stmt->bind_param("sss", $nombre, $especialidad, $numeroOriginal);

// Ejecutar la consulta preparada
if ($stmt->execute()) {
    // Si la actualización fue exitosa, devolver respuesta de éxito
    echo json_encode([
        'success' => true,
        'message' => 'Profesor actualizado exitosamente'
    ]);
} else {
    // Si ocurrió un error durante la ejecución, devolver mensaje detallado
    echo json_encode(['error' => 'Error al actualizar el profesor: ' . $conn->error]);
}

// Cerrar la conexión con la base de datos
$conn->close();
?>