<?php
header('Content-Type: application/json');

// 🔐 Verificar que las variables de entorno de Railway existan
$required_env = ['MYSQLHOST', 'MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE', 'MYSQLPORT'];
foreach ($required_env as $env) {
    if (empty(getenv($env))) {
        echo json_encode([
            "status" => "error",
            "message" => "Faltan variables de entorno de Railway. Asegúrate de haber configurado MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE y MYSQLPORT."
        ]);
        exit;
    }
}

// ⚙️ Configuración de conexión a Railway
$servername = getenv('MYSQLHOST');
$username   = getenv('MYSQLUSER');
$password   = getenv('MYSQLPASSWORD');
$dbname     = getenv('MYSQLDATABASE');
$port       = getenv('MYSQLPORT');

// 🔗 Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// 🚨 Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// 🧾 Obtener número de control desde GET
$numero_control = $_GET['numero_control'] ?? '';

if (strlen($numero_control) !== 8) {
    echo json_encode(["status" => "error", "message" => "Número de control inválido (debe tener 8 caracteres)"]);
    exit;
}

// 📘 Consulta SQL: obtener calificaciones con información del alumno, materia y profesor
$sql = "SELECT 
            c.id, 
            c.alumno_nombre, 
            c.numero_de_control, 
            c.materia_id, 
            m.nombre AS materia_nombre,
            c.calificacion, 
            c.profesor_id, 
            p.nombre AS profesor_nombre
        FROM calificaciones c
        LEFT JOIN materias m ON c.materia_id = m.id
        LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
        WHERE c.numero_de_control = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $numero_control);
$stmt->execute();
$result = $stmt->get_result();

// 📦 Construir respuesta
$calificaciones = [];
while ($row = $result->fetch_assoc()) {
    $calificaciones[] = $row;
}

if (empty($calificaciones)) {
    echo json_encode([
        "status" => "info",
        "message" => "No se encontraron calificaciones para el alumno con número de control $numero_control."
    ]);
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

// 🔚 Cerrar conexión
$stmt->close();
$conn->close();
?>
