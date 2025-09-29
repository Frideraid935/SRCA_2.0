<?php
// Establece que la respuesta será en formato JSON
header('Content-Type: application/json');

// Configuración de conexión a la base de datos
$servername = "localhost";         // Servidor local (por defecto en entornos XAMPP/WAMP)
$username = "root";                // Usuario por defecto de MySQL
$password = "1234";                // Contraseña del usuario
$dbname = "srca";                  // Nombre de la base de datos

// Crea una nueva conexión con la base de datos usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica si hubo un error al conectar
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtiene el parámetro 'id' desde POST y lo limpia de espacios extras
$id = isset($_POST['id']) ? trim($_POST['id']) : null;

// Si se proporciona un ID, se busca el salón específico
if ($id !== null && $id !== '') {
    // Prepara consulta SQL para obtener un salón por su ID con información del profesor asignado
    $stmt = $conn->prepare("SELECT 
                                s.id, 
                                s.nombre, 
                                s.capacidad, 
                                s.profesor_id,
                                p.nombre AS profesor_nombre
                            FROM salones s
                            LEFT JOIN profesores p ON s.profesor_id = p.numero_de_control
                            WHERE s.id = ?");
    
    // Vincula el parámetro ID como entero
    $stmt->bind_param("i", $id);
    
    // Ejecuta la consulta
    $stmt->execute();
    
    // Obtiene los resultados
    $res = $stmt->get_result();

    // Verifica si se encontró algún registro
    if ($res->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Salón no encontrado']);
    } else {
        // Obtiene los datos del salón y devuelve uno solo en formato de arreglo
        $salon = $res->fetch_assoc();
        echo json_encode(['status' => 'success', 'data' => [$salon]]);
    }
    
    // Cierra el statement
    $stmt->close();

// Si NO se proporciona un ID, se devuelven todos los salones
} else {
    // Consulta SQL para obtener todos los salones con información del profesor asignado
    $result = $conn->query("SELECT 
                                s.id, 
                                s.nombre, 
                                s.capacidad, 
                                s.profesor_id,
                                p.nombre AS profesor_nombre
                            FROM salones s
                            LEFT JOIN profesores p ON s.profesor_id = p.numero_de_control
                            ORDER BY s.id ASC");
    
    // Arreglo donde se almacenarán los resultados
    $salones = [];

    // Recorre los resultados y los agrega al arreglo
    while ($row = $result->fetch_assoc()) {
        $salones[] = $row;
    }

    // Devuelve los datos o mensaje según corresponda
    if (count($salones) > 0) {
        echo json_encode(['status' => 'success', 'data' => $salones]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No hay salones registrados']);
    }
}

// Cierra la conexión con la base de datos
$conn->close();
?>