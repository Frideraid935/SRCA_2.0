<?php
// Establece el tipo de contenido como JSON para la respuesta HTTP
header('Content-Type: application/json');

// Configuración de conexión a la base de datos
$servername = "localhost"; // Nombre del servidor donde está alojada la base de datos
$username = "root";        // Usuario de la base de datos
$password = "1234";        // Contraseña del usuario
$dbname = "srca";          // Nombre de la base de datos

// Crea una nueva conexión con la base de datos usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica si hubo un error al conectar con la base de datos
if ($conn->connect_error) {
    // Responde con un mensaje de error en formato JSON y termina la ejecución
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtiene el parámetro 'id' desde la solicitud POST y lo convierte a entero
$id = isset($_POST['id']) ? intval($_POST['id']) : null;

// Valida que el ID sea válido (entero positivo)
if (!$id || $id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'ID de salón no válido']);
    exit;
}

// Inicia una transacción para asegurar la integridad de los datos durante las operaciones
$conn->begin_transaction();

try {
    // 1. Prepara y ejecuta una consulta para obtener los datos del salón a eliminar
    $stmtSelect = $conn->prepare("SELECT * FROM salones WHERE id = ?");
    $stmtSelect->bind_param("i", $id); // Vincula el parámetro ID como entero
    $stmtSelect->execute();            // Ejecuta la consulta
    $result = $stmtSelect->get_result(); // Obtiene el resultado

    // Si no se encontró ningún salón con ese ID, lanza una excepción
    if ($result->num_rows === 0) {
        throw new Exception('No se encontró un salón con ese ID');
    }

    // Obtiene los datos del salón encontrado
    $salon = $result->fetch_assoc();

    // 2. Prepara y ejecuta la consulta para eliminar el salón de la tabla
    $stmtDelete = $conn->prepare("DELETE FROM salones WHERE id = ?");
    $stmtDelete->bind_param("i", $id); // Vincula el ID como entero
    $stmtDelete->execute();            // Ejecuta la eliminación

    // Si no se eliminó ninguna fila, lanza una excepción
    if ($stmtDelete->affected_rows === 0) {
        throw new Exception('No se pudo eliminar el salón');
    }

    // 3. Opcional: Aquí podrías agregar lógica para registrar este evento en una tabla de historial o eliminados

    // Confirma la transacción
    $conn->commit();

    // Envía una respuesta exitosa con los datos del salón eliminado
    echo json_encode([
        'status' => 'success', 
        'message' => '✅ Salón eliminado exitosamente',
        'data' => $salon // Devuelve los datos del salón eliminado
    ]);
} catch (Exception $e) {
    // En caso de error, deshace todos los cambios realizados durante la transacción
    $conn->rollback();

    // Envía una respuesta de error con el mensaje correspondiente
    echo json_encode([
        'status' => 'error',
        'message' => '❌ ' . $e->getMessage()
    ]);
}

// Cierra la conexión con la base de datos
$conn->close();
?>