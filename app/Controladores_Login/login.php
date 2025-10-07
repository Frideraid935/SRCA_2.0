<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===== VARIABLES DE ENTORNO DE RAILWAY =====
$servername = getenv('MYSQLHOST');
$username   = getenv('MYSQLUSER');
$password   = getenv('MYSQLPASSWORD');
$dbname     = getenv('MYSQLDATABASE');
$port       = getenv('MYSQLPORT') ?: 3306;

// ===== DEBUG VARIABLES =====
error_log("=== VARIABLES DE RAILWAY DETECTADAS ===");
error_log("MYSQLHOST=$servername");
error_log("MYSQLUSER=$username");
error_log("MYSQLDATABASE=$dbname");
error_log("MYSQLPORT=$port");
error_log("=======================================");

// ===== VERIFICAR VARIABLES OBLIGATORIAS =====
if (empty($servername) || empty($username) || empty($password) || empty($dbname)) {
    die("❌ Error: faltan variables de entorno de Railway. 
    Asegúrate de haber configurado:
    MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE y MYSQLPORT.");
}

// ===== CONEXIÓN TCP A RAILWAY =====
try {
    $dsn = "mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8";
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("✅ Conectado correctamente a la base de datos Railway ($dbname)");
} catch (PDOException $e) {
    die("❌ Error de conexión a Railway: " . $e->getMessage());
}

// ===== FUNCIÓN GENERAL DE LOGIN =====
function verificarLogin($conn, $tabla, $usuario, $contrasena, $campos) {
    $sql = "SELECT * FROM $tabla WHERE {$campos[0]} = :usuario";
    if ($tabla != 'administradores') {
        $sql .= " AND {$campos[1]} = :contrasena";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':usuario', $usuario);
    if ($tabla != 'administradores') {
        $stmt->bindParam(':contrasena', $contrasena);
    }

    $stmt->execute();
    return $stmt->rowCount() == 1 ? $stmt->fetch(PDO::FETCH_ASSOC) : false;
}

// ===== PROCESAR LOGIN =====
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $contrasena = trim($_POST['contraseña'] ?? '');

    error_log("🔐 Intento de login - Usuario: $usuario");

    // === Administrador ===
    $admin = verificarLogin($conn, 'administradores', $usuario, $contrasena, ['usuario','contrasena']);
    if ($admin) {
        if (password_verify($contrasena, $admin['contrasena']) || $contrasena === $admin['contrasena']) {
            $_SESSION['tipo_usuario'] = 'administrador';
            $_SESSION['usuario'] = $admin['usuario'];
            header("Location: ../Menu_Inicio/inicio_Admin.html");
            exit();
        } else {
            $error = "Contraseña incorrecta para administrador";
        }
    } else {
        // === Alumno ===
        $alumno = verificarLogin($conn, 'alumnos', $usuario, $contrasena, ['nombre','numero_de_control']);
        if ($alumno) {
            $_SESSION['tipo_usuario'] = 'alumno';
            $_SESSION['numero_control'] = $alumno['numero_de_control'];
            $_SESSION['nombre'] = $alumno['nombre'];
            header("Location: ../Menu_Inicio/inicio_Alumno.html");
            exit();
        } else {
            // === Profesor ===
            $profesor = verificarLogin($conn, 'profesores', $usuario, $contrasena, ['nombre','numero_de_control']);
            if ($profesor) {
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
$_SESSION['error_login'] = $error ?? "Error desconocido en el login";
header("Location: ../Logins/login.html");
exit();
?>
