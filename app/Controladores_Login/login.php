<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===== CONFIGURACIÓN DE CONEXIÓN =====
function obtenerConexion() {
    $conn = null;

    // 1️⃣ Intentar Railway
    $railwayHost = getenv('MYSQLHOST');
    if ($railwayHost) {
        $servername = $railwayHost;
        $username   = getenv('MYSQLUSER');
        $password   = getenv('MYSQLPASSWORD');
        $dbname     = getenv('MYSQLDATABASE');
        $port       = getenv('MYSQLPORT') ?: 3306;

        try {
            $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            error_log("Conectado a Railway correctamente.");
            return $conn;
        } catch (PDOException $e) {
            error_log("No se pudo conectar a Railway: " . $e->getMessage());
            $conn = null; // fallback
        }
    }

    // 2️⃣ Intentar Docker / Local
    $servername = getenv('DB_HOST') ?: 'localhost';
    $username   = getenv('DB_USER') ?: 'root';
    $password   = getenv('DB_PASS') ?: '1234';
    $dbname     = getenv('DB_NAME') ?: 'srca';
    $port       = getenv('DB_PORT') ?: 3306;

    try {
        $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        error_log("Conectado a Docker/local correctamente.");
        return $conn;
    } catch (PDOException $e) {
        die("No se pudo conectar a ninguna base de datos: " . $e->getMessage());
    }
}

$conn = obtenerConexion();

// ===== PROCESAR LOGIN =====
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $contrasena = trim($_POST['contraseña'] ?? '');

    error_log("Intento de login: Usuario: $usuario");

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
