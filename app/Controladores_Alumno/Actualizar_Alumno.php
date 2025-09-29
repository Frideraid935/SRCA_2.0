<?php
// Establece el tipo de contenido que se devolverá al cliente (en este caso JSON) RF_02
header('Content-Type: application/json');

// Configuración de la conexión a la base de datos
$servername = "localhost";      // Nombre del servidor de base de datos
$username = "root";              // Usuario de la base de datos
$password = "1234";              // Contraseña del usuario
$dbname = "srca";                // Nombre de la base de datos

// Crear una nueva conexión a la base de datos usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hubo un error en la conexión
if ($conn->connect_error) {
    // Devuelve una respuesta JSON de error si no se puede conectar a la BD
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit; // Detiene la ejecución del script
}

// Recibe los datos enviados desde el formulario en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

// Extraer campos obligatorios del alumno desde los datos recibidos
$numero_de_control = $data['numero_de_control'] ?? null;
$nombre = $data['nombre'] ?? null;
$fecha_nacimiento = $data['fecha_nacimiento'] ?? null;
$curso = $data['curso'] ?? null;
$poblacion = $data['poblacion'] ?? null;
$direccion = $data['direccion'] ?? null;
$email = $data['email'] ?? null;
$telefonos = $data['telefonos'] ?? null;
$curp = $data['curp'] ?? null;
$estatus = $data['estatus'] ?? null;

// Extraer campos opcionales del alumno (pueden estar vacíos)
$alergico = $data['alergico'] ?? null;
$contacto_accidente = $data['contacto_accidente'] ?? null;
$telefonos_contacto = $data['telefonos_contacto'] ?? null;
$nombre_autorizado = $data['nombre_autorizado'] ?? null;
$curp_autorizado = $data['curp_autorizado'] ?? null;

// Validación: comprobar que todos los campos obligatorios tengan contenido
if (!$numero_de_control || !$nombre || !$fecha_nacimiento || !$curso || !$poblacion || 
    !$direccion || !$email || !$telefonos || !$curp || !$estatus) {
    
    // Si falta algún campo obligatorio, devuelve mensaje de error y termina
    echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios."]);
    exit;
}

// Consulta SQL para actualizar los datos del alumno en la tabla 'alumnos'
$sql_actualizar = "UPDATE alumnos SET 
    nombre = ?, fecha_nacimiento = ?, curso = ?, poblacion = ?, direccion = ?, email = ?, telefonos = ?, curp = ?,
    estatus = ?, alergico = ?, contacto_accidente = ?, telefonos_contacto = ?, nombre_autorizado = ?, curp_autorizado = ?
    WHERE numero_de_control = ?";

// Preparar la consulta SQL para evitar inyecciones
$stmt_actualizar = $conn->prepare($sql_actualizar);

// Vincula los parámetros de tipo string ('s') con sus valores
$stmt_actualizar->bind_param(
    "sssssssssssssss",  // Cada '?' en la consulta se reemplazará por estos 15 valores
    $nombre, $fecha_nacimiento, $curso, $poblacion, $direccion, $email, $telefonos, $curp,
    $estatus, $alergico, $contacto_accidente, $telefonos_contacto, $nombre_autorizado, $curp_autorizado, $numero_de_control
);

// Ejecutar la consulta preparada
if ($stmt_actualizar->execute()) {
    // Verifica si se afectó alguna fila (es decir, si se encontró y actualizó el registro
    if ($stmt_actualizar->affected_rows > 0) {
        // Si se realizaron cambios, enviar respuesta de éxito
        echo json_encode(["status" => "success", "message" => "Alumno actualizado exitosamente."]);
    } else {
        // Si no se encontró el alumno con ese número de control
        echo json_encode(["status" => "error", "message" => "No se encontró ningún alumno con ese número de control."]);
    }
} else {
    // Si ocurrió un error al ejecutar la consulta
    echo json_encode(["status" => "error", "message" => "Error al actualizar el alumno: " . $stmt_actualizar->error]);
}

// Cerrar la declaración y la conexión a la base de datos
$stmt_actualizar->close();
$conn->close();

// Fin del script
?>