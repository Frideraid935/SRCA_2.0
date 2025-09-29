<?php
// Establece el tipo de contenido de la respuesta como JSON
header("Content-Type: application/json");

// Configuración de la conexión a la base de datos
$servername = "localhost";      // Servidor local (por defecto en entornos de desarrollo)
$username = "root";              // Usuario por defecto de MySQL
$password = "1234";              // Contraseña del usuario de la base de datos
$dbname = "srca";                // Nombre de la base de datos a utilizar

// Crear una nueva conexión con MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hubo un error en la conexión
if ($conn->connect_error) {
    // Enviar mensaje de error en formato JSON y terminar ejecución
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

// Consulta SQL para obtener todos los registros de la tabla 'salones', ordenados por ID ascendente
$sql = "SELECT * FROM salones ORDER BY id ASC";

// Ejecutar la consulta y obtener el resultado
$resultado = $conn->query($sql);

// Inicializar un arreglo vacío para almacenar los datos de los salones
$salones = [];

// Verificar si la consulta devolvió resultados
if ($resultado && $resultado->num_rows > 0) {
    // Recorrer cada fila del resultado y agregarla al arreglo
    while ($fila = $resultado->fetch_assoc()) {
        $salones[] = $fila;
    }
    // Devolver los salones encontrados en formato JSON
    echo json_encode($salones);
} else {
    // Si no hay registros, devolver un arreglo vacío en formato JSON
    echo json_encode([]); 
}

// Cerrar la conexión a la base de datos
$conn->close();
?>