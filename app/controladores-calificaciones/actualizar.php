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

// Determinar acción
$action = $_GET['action'] ?? null;

// Procesar según la acción
if ($action === 'buscar') {
    // Buscar calificación por ID
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    
    if (!$id || $id <= 0) {
        echo json_encode(["status" => "error", "message" => "ID de calificación no válido"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM calificaciones WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "No se encontró la calificación con ID $id"]);
    } else {
        $calificacion = $result->fetch_assoc();
        echo json_encode(["status" => "success", "data" => $calificacion]);
    }
    
    $stmt->close();

} elseif ($action === 'actualizar') {
    // Actualizar calificación existente
    
    // Recibir datos del formulario
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $data = $_POST;
    }

    // Validar ID
    $id = $data['id'] ?? 0;
    if (empty($id) || !is_numeric($id)) {
        echo json_encode(["status" => "error", "message" => "ID de calificación no válido"]);
        exit;
    }

    // Asignar valores
    $alumno_nombre = $data['alumno_nombre'] ?? '';
    $numero_control = $data['numero_control'] ?? '';
    $materia_id = $data['materia_id'] ?? 0;
    $calificacion = $data['calificacion'] ?? 0.0;
    $profesor_nombre = $data['profesor_nombre'] ?? '';

    // Validaciones básicas
    $errors = [];

    if (empty($alumno_nombre)) {
        $errors[] = "El nombre del alumno es requerido";
    }

    if (empty($numero_control) || strlen($numero_control) != 8) {
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
        "SELECT numero_de_control FROM alumnos WHERE numero_de_control = ?",
        [$numero_control],
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

    // Verificar profesor
    $profesorExiste = verificarExistencia(
        $conn,
        "SELECT nombre FROM profesores WHERE nombre = ?",
        [$profesor_nombre],
        "s",
        "El profesor no existe"
    );

    if ($profesorExiste !== true) {
        echo json_encode(["status" => "error", "message" => $profesorExiste]);
        exit;
    }

    // Actualizar la calificación
    $sql_update = "UPDATE calificaciones SET 
                  alumno_nombre = ?, 
                  numero_control = ?,
                  materia_id = ?,
                  calificacion = ?,
                  profesor_nombre = ?,
                  fecha_actualizacion = NOW()
                  WHERE id = ?";

    $stmt_update = $conn->prepare($sql_update);

    // Asegurar tipos correctos
    $materia_id = (int)$materia_id;
    $calificacion = (float)$calificacion;
    $id = (int)$id;

    $stmt_update->bind_param("ssidsi", $alumno_nombre, $numero_control, $materia_id, $calificacion, $profesor_nombre, $id);

    if ($stmt_update->execute()) {
        $affected_rows = $stmt_update->affected_rows;
        if ($affected_rows > 0) {
            echo json_encode([
                "status" => "success", 
                "message" => "Calificación actualizada exitosamente",
                "affected_rows" => $affected_rows
            ]);
        } else {
            echo json_encode([
                "status" => "warning", 
                "message" => "No se realizaron cambios (los datos son iguales)"
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Error al actualizar calificación: " . $stmt_update->error,
            "error_details" => $conn->error
        ]);
    }

    $stmt_update->close();
} else {
    echo json_encode(["status" => "error", "message" => "Acción no válida"]);
}

$conn->close();
?>