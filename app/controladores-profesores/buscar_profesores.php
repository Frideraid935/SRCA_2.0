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

// Obtener el número de control desde los parámetros GET
$numeroControl = $_GET['numero_de_control'] ?? '';

// Validación: El número de control debe estar presente
if (empty($numeroControl)) {
    echo json_encode(['error' => 'Número de control no proporcionado']);
    exit;
}

// Preparar consulta SQL para buscar al profesor por su número de control
$sql = "SELECT * FROM profesores WHERE numero_de_control = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $numeroControl); // Vincular parámetro como string
$stmt->execute();                        // Ejecutar la consulta
$result = $stmt->get_result();          // Obtener resultados

// Verificar si no se encontró ningún profesor con ese número de control
if ($result->num_rows === 0) {
    echo json_encode(['error' => 'No se encontró un profesor con este número de control']);
    exit;
}

// Obtener los datos del profesor como un arreglo asociativo
$profesor = $result->fetch_assoc();

// Devolver los datos del profesor en formato JSON
echo json_encode($profesor);

// Cerrar la conexión con la base de datos
$conn->close();
?>