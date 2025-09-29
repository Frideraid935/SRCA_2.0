<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$host = "localhost";
$user = "root";
$password = "1234";
$dbname = "crud";

// Leer datos del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID no proporcionado.']);
    exit;
}

// Crear conexión
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error al conectar con la base de datos.']);
    exit;
}

// Eliminar alumno
$sql = "DELETE FROM alumnos WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("i", $id);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Alumno eliminado correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Alumno no encontrado.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Error en la consulta.']);
}

$conn->close();
?>
