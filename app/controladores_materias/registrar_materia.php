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
    
    if (empty($data['nombre'])) {
        throw new Exception("El nombre de la materia es obligatorio");
    }

    // Verificar si se proporcionó un ID manual
    if (isset($data['id']) && !empty($data['id'])) {
        $id = (int)$data['id'];
        
        // Verificar si el ID ya existe
        $check = $conn->prepare("SELECT id FROM materias WHERE id = ?");
        $check->bind_param("i", $id);
        $check->execute();
        $check->store_result();
        
        if ($check->num_rows > 0) {
            throw new Exception("El ID {$id} ya está en uso");
        }
        $check->close();

        // Insertar con ID manual
        $stmt = $conn->prepare("INSERT INTO materias (id, nombre) VALUES (?, ?)");
        $stmt->bind_param("is", $id, $data['nombre']);
    } else {
        // Insertar con ID automático
        $stmt = $conn->prepare("INSERT INTO materias (nombre) VALUES (?)");
        $stmt->bind_param("s", $data['nombre']);
    }
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Materia registrada exitosamente',
            'id' => $stmt->insert_id
        ]);
    } else {
        throw new Exception("Error al registrar: " . $stmt->error);
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