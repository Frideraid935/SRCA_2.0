<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "srca";

try {
    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }

    // Obtener ID del parámetro GET
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        throw new Exception("ID de materia inválido");
    }

    // Buscar la materia
    $stmt = $conn->prepare("SELECT id, nombre FROM materias WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("No se encontró la materia con ID $id");
    }
    
    $materia = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'materia' => [
            'id' => $materia['id'],
            'nombre' => $materia['nombre']
        ]
    ]);
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>