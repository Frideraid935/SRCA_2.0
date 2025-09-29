<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "1234", "srca");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión"]);
    exit;
}

$numero_control = $_GET['numero_control'] ?? '';

if (strlen($numero_control) !== 8) {
    echo json_encode(["status" => "error", "message" => "Número de control inválido"]);
    exit;
}

// Consulta para obtener calificaciones con información de materia y profesor
$sql = "SELECT c.id, c.alumno_nombre, c.numero_de_control, 
               c.materia_id, m.nombre as materia_nombre,
               c.calificacion, c.profesor_id, 
               p.nombre as profesor_nombre
        FROM calificaciones c
        LEFT JOIN materias m ON c.materia_id = m.id
        LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
        WHERE c.numero_de_control = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $numero_control);
$stmt->execute();
$result = $stmt->get_result();

$calificaciones = [];
while ($row = $result->fetch_assoc()) {
    $calificaciones[] = $row;
}

if (empty($calificaciones)) {
    echo json_encode(["status" => "info", "message" => "No se encontraron calificaciones"]);
} else {
    echo json_encode([
        "status" => "success",
        "data" => [
            "alumno_nombre" => $calificaciones[0]['alumno_nombre'],
            "numero_control" => $calificaciones[0]['numero_de_control'],
            "calificaciones" => $calificaciones
        ]
    ]);
}

$stmt->close();
$conn->close();
?>