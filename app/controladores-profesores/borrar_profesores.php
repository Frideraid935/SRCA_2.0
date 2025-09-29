<?php
// Establece el tipo de contenido como JSON para la respuesta HTTP
header('Content-Type: application/json');

// Configuración de los parámetros de conexión a la base de datos
$servername = "localhost";     // Nombre del servidor de la base de datos
$username = "root";            // Usuario de la base de datos
$password = "1234";            // Contraseña del usuario
$dbname = "srca";              // Nombre de la base de datos

// Crear conexión usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hubo un error en la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]));
}

// Obtener el número de control desde los parámetros GET
$numeroControl = $_GET['numero_de_control'] ?? '';

// Validación: El número de control debe estar presente
if (empty($numeroControl)) {
    echo json_encode(['error' => 'Número de control no proporcionado']);
    exit;
}

// Iniciar una transacción para garantizar integridad en las operaciones
$conn->begin_transaction();

try {
    // 1. Preparar consulta para obtener los datos del profesor
    $sqlSelect = "SELECT * FROM profesores WHERE numero_de_control = ?";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->bind_param("s", $numeroControl); // Vincular como string
    $stmtSelect->execute();                      // Ejecutar consulta
    $result = $stmtSelect->get_result();         // Obtener resultados

    // Si no se encontró ningún profesor con ese número de control
    if ($result->num_rows === 0) {
        throw new Exception('No se encontró un profesor con este número de control');
    }

    // Obtener los datos del profesor
    $profesor = $result->fetch_assoc();

    // 2. Insertar una copia del registro en la tabla de historial/eliminados
    $sqlInsert = "INSERT INTO profesores_eliminados 
                  (numero_de_control, nombre, especialidad, fecha_eliminacion) 
                  VALUES (?, ?, ?, NOW())";
    
    $stmtInsert = $conn->prepare($sqlInsert);
    $stmtInsert->bind_param(
        "sss",
        $profesor['numero_de_control'], // Número de control
        $profesor['nombre'],            // Nombre del profesor
        $profesor['especialidad']       // Especialidad del profesor
    );

    // Ejecutar inserción en historial
    if (!$stmtInsert->execute()) {
        throw new Exception('Error al guardar en historial de eliminados');
    }

    // 3. Eliminar al profesor de la tabla principal
    $sqlDelete = "DELETE FROM profesores WHERE numero_de_control = ?";
    $stmtDelete = $conn->prepare($sqlDelete);
    $stmtDelete->bind_param("s", $numeroControl); // Vincular como string

    // Ejecutar eliminación
    if (!$stmtDelete->execute()) {
        throw new Exception('Error al eliminar el profesor');
    }

    // Confirmar todas las operaciones (commit)
    $conn->commit();

    // Enviar respuesta de éxito
    echo json_encode([
        'success' => true,
        'message' => 'Profesor eliminado y registrado en historial correctamente'
    ]);

} catch (Exception $e) {
    // En caso de cualquier error, revertir la transacción
    $conn->rollback();

    // Enviar mensaje de error detallado
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

// Cerrar la conexión con la base de datos
$conn->close();
?>