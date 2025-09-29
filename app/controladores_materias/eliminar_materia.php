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

    // Obtener datos del POST
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validaciones
    if (empty($data['id'])) {
        throw new Exception("El ID de la materia es obligatorio");
    }

    // Verificar si la materia existe
    $check = $conn->prepare("SELECT id FROM materias WHERE id = ?");
    $check->bind_param("i", $data['id']);
    $check->execute();
    $check->store_result();
    
    if ($check->num_rows === 0) {
        throw new Exception("No existe una materia con el ID especificado");
    }
    $check->close();

    // Eliminar la materia
    $stmt = $conn->prepare("DELETE FROM materias WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Materia eliminada exitosamente',
            'id_eliminado' => $data['id']
        ]);
    } else {
        throw new Exception("Error al eliminar: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>