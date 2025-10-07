<?php
// ===============================
// Controlador de login (login.php)
// ===============================

session_start();
header("Content-Type: text/html; charset=UTF-8");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===== CONFIGURACIÓN DE RAILWAY =====
$host     = getenv('MYSQLHOST');
$user     = getenv('MYSQLUSER');
$password = getenv('MYSQLPASSWORD');
$dbname   = getenv('MYSQL_DATABASE'); // ⚠️ Railway la define con guion bajo
$port     = getenv('MYSQLPORT') ?: 3306;

// ===== DEPURACIÓN OPCIONAL =====
error_log("MYSQLHOST=$host");
error_log("MYSQLUSER=$user");
error_log("MYSQL_DATABASE=$dbname");
error_log("MYSQLPORT=$port");

// ===== VALIDAR VARIABLES =====
if (empty($host) || empty($user) || empty($password) || empty($dbname)) {
    die("❌ Error: faltan variables de entorno de Railway.
    <br>Asegúrate de haber configurado:<br>
    MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQL_DATABASE y MYSQLPORT.");
}

// ===== CONEXIÓN =====
try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("✅ Conexión a Railway exitosa");
} catch (PDOException $e) {
    die("❌ Error de conexión a Railway: " . $e->getMessage());
}

// ===== PROCESAR FORMULARIO DE LOGIN =====
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = trim($_POST['usuario']);
    $contrasena = trim($_POST['contraseña']);

    error_log("Intento de login: Usuario=$usuario");

    // --- Verificar si es administrador ---
    $stmt = $conn->prepare("SELECT * FROM administradores WHERE usuario = :usuario");
    $stmt->bindParam(':usuario', $usuario);
    $stmt->execute();

    if ($stmt->rowCount() == 1) {
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        error_log("Admin encontrado: " . print_r($admin, true));

        if (password_verify($contrasena, $admin['contrasena']) || $contrasena === $admin['contrasena']) {
            $_SESSION['tipo_usuario'] = 'administrador';
            $_SESSION['usuario'] = $admin['usuario'];
            header("Location: ../Menu_Inicio/inicio_Admin.html");
            exit();
        } else {
            $error = "Contraseña incorrecta para administrador";
        }

    } else {
        // --- Verificar si es alumno ---
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
            // --- Verificar si es profesor ---
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

// ===== MANEJO DE ERRORES =====
if (isset($error)) {
    $_SESSION['error_login'] = $error;
} else {
    $_SESSION['error_login'] = "Error desconocido en el login";
}

// Redirigir de vuelta al login
header("Location: ../Logins/login.html");
exit();

?>
