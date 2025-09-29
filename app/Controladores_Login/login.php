<?php
// Controlador de login (login.php)
session_start();

// Configuración de la base de datos
$host = "localhost";
$dbname = "srca";
$username = "root";
$password = "1234";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Procesar el formulario de login
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = trim($_POST['usuario']);
    $contrasena = trim($_POST['contraseña']);

    // DEBUG: Mostrar datos recibidos (eliminar en producción)
    error_log("Intento de login: Usuario: $usuario, Contraseña: $contrasena");

    // Verificar primero si es administrador
    $stmt = $conn->prepare("SELECT * FROM administradores WHERE usuario = :usuario");
    $stmt->bindParam(':usuario', $usuario);
    $stmt->execute();
    
    if ($stmt->rowCount() == 1) {
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // DEBUG: Mostrar datos del admin (eliminar en producción)
        error_log("Admin encontrado: " . print_r($admin, true));
        
        // Opción 1: Si las contraseñas están hasheadas
        if (password_verify($contrasena, $admin['contrasena'])) {
            // Login exitoso como administrador
            $_SESSION['tipo_usuario'] = 'administrador';
            $_SESSION['usuario'] = $admin['usuario'];
            header("Location: ../Menu_Inicio/inicio_Admin.html");
            exit();
        } 
        // Opción 2: Si las contraseñas NO están hasheadas (texto plano)
        elseif ($contrasena === $admin['contrasena']) {
            // Login exitoso como administrador
            $_SESSION['tipo_usuario'] = 'administrador';
            $_SESSION['usuario'] = $admin['usuario'];
            header("Location: ../Menu_Inicio/inicio_Admin.html");
            exit();
        }
        else {
            $error = "Contraseña incorrecta para administrador";
            error_log("Contraseña incorrecta para admin: $usuario");
        }
    } else {
        error_log("No se encontró admin con usuario: $usuario");
        
        // Resto del código para alumnos y profesores...
        $stmt = $conn->prepare("SELECT * FROM alumnos WHERE nombre = :usuario AND numero_de_control = :contrasena");
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrasena', $contrasena);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $alumno = $stmt->fetch(PDO::FETCH_ASSOC);
            $_SESSION['tipo_usuario'] = 'alumno';
            $_SESSION['numero_control'] = $alumno['numero_de_control'];
            $_SESSION['nombre'] = $alumno['nombre'];
            header("Location: ../Menu_Inicio/inicio_Alumno.html");
            exit();
        } else {
            $stmt = $conn->prepare("SELECT * FROM profesores WHERE nombre = :usuario AND numero_de_control = :contrasena");
            $stmt->bindParam(':usuario', $usuario);
            $stmt->bindParam(':contrasena', $contrasena);
            $stmt->execute();
            
            if ($stmt->rowCount() == 1) {
                $profesor = $stmt->fetch(PDO::FETCH_ASSOC);
                $_SESSION['tipo_usuario'] = 'profesor';
                $_SESSION['numero_control'] = $profesor['numero_de_control'];
                $_SESSION['nombre'] = $profesor['nombre'];
                header("Location: ../Menu_Inicio/inicio_profesor.html");
                exit();
            } else {
                $error = "Credenciales incorrectas. Por favor, intente nuevamente.";
            }
        }
    }
}

// Manejo de errores
if (isset($error)) {
    $_SESSION['error_login'] = $error;
} else {
    $_SESSION['error_login'] = "Error desconocido en el login";
}

// Redirigir de vuelta al formulario de login con mensaje de error
header("Location: ../Logins/login.html");
exit();
?>