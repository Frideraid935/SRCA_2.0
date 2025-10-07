<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===== DETECTAR ENTORNO =====
$isRailway = getenv('MYSQLHOST') !== false; // Si existe MYSQLHOST, estamos en Railway

if ($isRailway) {
    // 🌐 Configuración para Railway
    $servername = getenv('MYSQLHOST');
    $username   = getenv('MYSQLUSER');
    $password   = getenv('MYSQLPASSWORD');
    $dbname     = getenv('MYSQLDATABASE');
    $port       = getenv('MYSQLPORT') ?: 3306;
} else {
    // 🐳 Configuración para Docker local
    $servername = getenv('DB_HOST') ?: 'srca_db';
    $username   = getenv('DB_USER') ?: 'root';
    $password   = getenv('DB_PASS') ?: '1234';
    $dbname     = getenv('DB_NAME') ?: 'srca';
    $port       = getenv('DB_PORT') ?: 3306;
}

// ===== CONEXIÓN A LA BASE DE DATOS =====
try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// ===== PROCESAR LOGIN =====
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $contrasena = trim($_POST['contraseña'] ?? '');

    error_log("Intento de login: Usuario: $usuario");

    // Función para verificar login
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
        if ($stmt->rowCount() == 1) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    // Administrador
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
        // Alumno
        $alumno = verificarLogin($conn, 'alumnos', $usuario, $contrasena, ['nombre','numero_de_control']);
        if ($alumno) {
            $_SESSION['tipo_usuario'] = 'alumno';
            $_SESSION['numero_control'] = $alumno['numero_de_control'];
            $_SESSION['nombre'] = $alumno['nombre'];
            header("Location: ../Menu_Inicio/inicio_Alumno.html");
            exit();
        } else {
            // Profesor
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

// Manejo de errores
$_SESSION['error_login'] = $error ?? "Error desconocido en el login";
header("Location: ../Logins/login.html");
exit();
?>
