<?php
// Configuración de la base de datos
$host = "localhost";
$user = "root"; 
$password = "1234"; 
$dbname = "crud"; 

// Crear la conexión
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos enviados desde el formulario
$numero_de_control = $_POST['numero_de_control'];

// Crear la consulta SQL para buscar por número de control
$sql = "SELECT * FROM alumnos WHERE numero_de_control LIKE ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    // Usar comodín para búsqueda parcial
    $control_busqueda = "%" . $numero_de_control . "%";
    $stmt->bind_param("s", $control_busqueda);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "<h3>Resultados encontrados:</h3>";
        echo "<ul>";
        while ($row = $result->fetch_assoc()) {
            echo "<li>";
            echo "<strong>Nombre:</strong> " . htmlspecialchars($row['nombre']) . "<br>";
            echo "<strong>Fecha de nacimiento:</strong> " . htmlspecialchars($row['fecha_nacimiento']) . "<br>";
            echo "<strong>Curso:</strong> " . htmlspecialchars($row['curso']) . "<br>";
            echo "<strong>Número de Control:</strong> " . htmlspecialchars($row['numero_de_control']) . "<br>";
            echo "<strong>Escuela:</strong> " . htmlspecialchars($row['poblacion']) . "<br>";
            echo "<strong>Dirección:</strong> " . htmlspecialchars($row['direccion']) . "<br>";
            echo "<strong>Email:</strong> " . htmlspecialchars($row['email']) . "<br>";
            echo "<strong>Teléfono:</strong> " . htmlspecialchars($row['telefonos']) . "<br>";
            echo "<strong>CURP:</strong> " . htmlspecialchars($row['curp']) . "<br>";
            echo "<strong>Alergias:</strong> " . htmlspecialchars($row['alergico']) . "<br>";
            echo "<strong>Accidente (Contactar a):</strong> " . htmlspecialchars($row['accidente']) . "<br>";
            echo "<strong>Teléfonos de contacto:</strong> " . htmlspecialchars($row['telefonos_contacto']) . "<br>";
            echo "</li><hr>";
        }
        echo "</ul>";
    } else {
        echo "<h3>No se encontraron resultados para el número de control '$numero_de_control'.</h3>";
    }

    $stmt->close();
} else {
    echo "<h3>Error en la consulta: " . $conn->error . "</h3>";
}

// Obtener los autorizados relacionados con el alumno
$sqlAutorizados = "SELECT * FROM autorizados WHERE alumno_id = (SELECT id FROM alumnos WHERE numero_de_control LIKE ?)";
$stmtAutorizados = $conn->prepare($sqlAutorizados);

if ($stmtAutorizados) {
    // Usar comodín para búsqueda parcial
    $stmtAutorizados->bind_param("s", $control_busqueda);
    $stmtAutorizados->execute();
    $resultAutorizados = $stmtAutorizados->get_result();

    if ($resultAutorizados->num_rows > 0) {
        echo "<h3>Autorizados:</h3>";
        echo "<ul>";
        while ($row = $resultAutorizados->fetch_assoc()) {
            echo "<li>";
            echo "<strong>Nombre del autorizado:</strong> " . htmlspecialchars($row['nombre']) . "<br>";
            echo "<strong>CURP del autorizado:</strong> " . htmlspecialchars($row['curp']) . "<br>";
            echo "</li><hr>";
        }
        echo "</ul>";
    } else {
        echo "<h3>No se encontraron autorizados para el número de control '$numero_de_control'.</h3>";
    }

    $stmtAutorizados->close();
} else {
    echo "<h3>Error en la consulta de autorizados: " . $conn->error . "</h3>";
}

// Cerrar la conexión
$conn->close();
?>
