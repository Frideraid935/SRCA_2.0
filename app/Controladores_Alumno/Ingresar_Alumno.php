<?php
// Configura el tipo de contenido de la respuesta como JSON. RF_01
header('Content-Type: application/json');

// Configuración de la conexión a la base de datos
$servername = "localhost"; // Dirección del servidor de la base de datos (generalmente localhost)
$username = "root";        // Nombre de usuario de la base de datos (ajustar según la configuración)
$password = "1234";        // Contraseña del usuario de la base de datos (ajustar según la configuración)
$dbname = "srca";          // Nombre de la base de datos (ajustar según la configuración)

// Crear una nueva conexión a la base de datos utilizando MySQLi0
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay un error en la conexión
if ($conn->connect_error) {
    // Si hay un error, devuelve un mensaje JSON con el estado y el mensaje de error
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit; // Termina la ejecución del script
}

// Recibir los datos enviados desde el formulario
$nombre = $_POST['nombre']; // Nombre del alumno
$fecha_nacimiento = $_POST['fecha_nacimiento']; // Fecha de nacimiento del alumno
$curso = $_POST['curso']; // Curso al que pertenece el alumno
$numero_de_control = $_POST['numero_de_control']; // Número de control único del alumno
$poblacion = $_POST['poblacion']; // Población donde vive el alumno
$direccion = $_POST['direccion']; // Dirección del alumno
$email = $_POST['email']; // Correo electrónico del alumno
$telefonos = $_POST['telefonos']; // Teléfonos del alumno
$curp = $_POST['curp']; // CURP del alumno
$alergico = $_POST['alergico'] ?? null; // Información sobre alergias (opcional)
$contacto_accidente = $_POST['contacto_accidente'] ?? null; // Contacto en caso de accidente (opcional)
$telefonos_contacto = $_POST['telefonos_contacto'] ?? null; // Teléfonos del contacto en caso de accidente (opcional)
$nombre_autorizado = $_POST['nombre_autorizado'] ?? null; // Nombre de la persona autorizada para recoger al alumno (opcional)
$curp_autorizado = $_POST['curp_autorizado'] ?? null; // CURP de la persona autorizada (opcional)

// Validar que el número de control sea único
$sql_check = "SELECT id FROM alumnos WHERE numero_de_control = ?";
$stmt_check = $conn->prepare($sql_check); // Prepara la consulta SQL para evitar inyecciones SQL
$stmt_check->bind_param("s", $numero_de_control); // Vincula el parámetro (cadena) al marcador de posición (?)
$stmt_check->execute(); // Ejecuta la consulta
$stmt_check->store_result(); // Almacena el resultado para verificar el número de filas

// Si ya existe un alumno con ese número de control, devuelve un mensaje de error
if ($stmt_check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El número de control ya existe."]);
    $stmt_check->close(); // Cierra la sentencia preparada
    $conn->close();       // Cierra la conexión a la base de datos
    exit;                 // Termina la ejecución del script
}

// Insertar datos en la base de datos
$sql_insert = "INSERT INTO alumnos (
    numero_de_control, nombre, fecha_nacimiento, curso, poblacion, direccion, email, telefonos, curp,
    alergico, contacto_accidente, telefonos_contacto, nombre_autorizado, curp_autorizado, estatus
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt_insert = $conn->prepare($sql_insert); // Prepara la consulta SQL para evitar inyecciones SQL
$estatus = "activo"; // Valor predeterminado para el campo estatus
$stmt_insert->bind_param(
    "sssssssssssssss",
    $numero_de_control, $nombre, $fecha_nacimiento, $curso, $poblacion, $direccion, $email, $telefonos,
    $curp, $alergico, $contacto_accidente, $telefonos_contacto, $nombre_autorizado, $curp_autorizado, $estatus
);

// Ejecutar la consulta de inserción
if ($stmt_insert->execute()) {
    // Si la inserción es exitosa, devuelve un mensaje de éxito en formato JSON
    echo json_encode(["status" => "success", "message" => "Alumno registrado exitosamente."]);
} else {
    // Si ocurre un error durante la inserción, devuelve un mensaje de error en formato JSON
    echo json_encode(["status" => "error", "message" => "Error al registrar el alumno: " . $stmt_insert->error]);
}

// Cerrar las sentencias preparadas y la conexión a la base de datos
$stmt_insert->close(); // Libera los recursos asociados a la sentencia de inserción
$stmt_check->close();  // Libera los recursos asociados a la sentencia de verificación
$conn->close();        // Cierra la conexión a la base de datos
?>