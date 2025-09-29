<?php
// Configura el tipo de contenido de la respuesta como JSON.RF_O4
header('Content-Type: application/json'); 

// Configuración de la conexión a la base de datos
$servername = "localhost"; // Dirección del servidor de la base de datos (generalmente localhost)
$username = "root";        // Nombre de usuario de la base de datos (ajustar según la configuración)
$password = "1234";        // Contraseña del usuario de la base de datos (ajustar según la configuración)
$dbname = "srca";          // Nombre de la base de datos (ajustar según la configuración)

// Crea una nueva conexión a la base de datos utilizando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica si hay un error en la conexión
if ($conn->connect_error) {
    // Si hay un error, devuelve un mensaje JSON con el estado y el mensaje de error
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit; // Termina la ejecución del script
}

// Recibir los datos enviados desde el cliente en formato JSON
$data = json_decode(file_get_contents("php://input"), true); // Decodifica el JSON recibido
$numero_de_control = $data['numero_de_control'] ?? null;     // Obtiene el número de control o asigna null si no existe

// Verifica si el número de control fue proporcionado
if (!$numero_de_control) {
    // Si no se proporcionó el número de control, devuelve un mensaje de error en formato JSON
    echo json_encode(["status" => "error", "message" => "Número de control no proporcionado."]);
    exit; // Termina la ejecución del script
}

// Prepara la consulta SQL para eliminar al alumno con el número de control especificado
$sql_eliminar = "DELETE FROM alumnos WHERE numero_de_control = ?";
$stmt_eliminar = $conn->prepare($sql_eliminar); // Prepara la sentencia SQL para evitar inyecciones SQL
$stmt_eliminar->bind_param("s", $numero_de_control); // Vincula el parámetro (cadena) al marcador de posición (?)

// Ejecuta la consulta SQL
if ($stmt_eliminar->execute()) {
    // Verifica si se afectaron filas en la base de datos
    if ($stmt_eliminar->affected_rows > 0) {
        // Si se eliminó al menos una fila, devuelve un mensaje de éxito en formato JSON RF_04
        echo json_encode(["status" => "success", "message" => "Alumno eliminado exitosamente."]);
    } else {
        // Si no se encontró ningún alumno con ese número de control, devuelve un mensaje de error
        echo json_encode(["status" => "error", "message" => "No se encontró ningún alumno con ese número de control."]);
    }
} else {
    // Si ocurrió un error durante la ejecución de la consulta, devuelve un mensaje de error
    echo json_encode(["status" => "error", "message" => "Error al eliminar el alumno: " . $stmt_eliminar->error]);
}

// Cierra la sentencia preparada y la conexión a la base de datos
$stmt_eliminar->close(); // Libera los recursos asociados a la sentencia
$conn->close();          // Cierra la conexión a la base de datos
?>