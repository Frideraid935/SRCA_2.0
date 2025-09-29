<?php
// Datos de la conexión
$servername = "localhost";
$username = "root";
$password = "1234"; 
$dbname = "crud";   

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay error en la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si el formulario fue enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los valores del formulario
    $usuario = $_POST['usuario'];
    $contraseña = $_POST['contraseña'];

    // Validación de los campos
    if (empty($usuario) || empty($contraseña)) {
        echo "Por favor ingrese el usuario y la contraseña.";
    } else {
        // Verificar en la tabla de alumnos
        $sqlAlumno = "SELECT * FROM alumnos WHERE nombre = ? AND numero_de_control = ?";
        $stmtAlumno = $conn->prepare($sqlAlumno);
        $stmtAlumno->bind_param("ss", $usuario, $contraseña); // Ambos parámetros: nombre y número de control
        $stmtAlumno->execute();
        $resultAlumno = $stmtAlumno->get_result();

        if ($resultAlumno->num_rows > 0) {
            // Alumno encontrado
            $alumno = $resultAlumno->fetch_assoc();

            // Redirigir al HTML de búsqueda para alumnos
            header("Location: ../Menu_inicio/inicio_Alumno.html");
            exit();
        } else {
            // Si no se encuentra el alumno, mostrar mensaje de error
            echo "Usuario o contraseña incorrectos.";
        }

        // Verificar en la tabla de administradores
        $sqlAdmin = "SELECT * FROM administradores_1 WHERE nombre = ? AND contrasena = ?";
        $stmtAdmin = $conn->prepare($sqlAdmin);
        $stmtAdmin->bind_param("ss", $usuario, $contraseña); // Ambos parámetros: nombre y contraseña
        $stmtAdmin->execute();
        $resultAdmin = $stmtAdmin->get_result();

        if ($resultAdmin->num_rows > 0) {
            // Administrador encontrado
            header("Location: ../Menu_Inicio/inicio_Admin.html");
            exit();
        } else {
            // Si no se encuentra el administrador, mostrar mensaje de error
            echo "Usuario o contraseña incorrectos.";
        }
    }

    // Cerrar las conexiones preparadas
    $stmtAlumno->close();
    $stmtAdmin->close();
}

$conn->close();
?>

