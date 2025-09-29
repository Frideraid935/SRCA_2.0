<?php
header('Content-Type: text/html; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "srca";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("<div class='mensaje error'>Error de conexión: " . $conn->connect_error . "</div>");
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'registrar':
        registrarAlumno($conn);
        break;
    case 'buscar':
        buscarAlumno($conn);
        break;
    case 'actualizar':
        actualizarAlumno($conn);
        break;
    case 'eliminar':
        eliminarAlumno($conn);
        break;
    default:
        echo "<div class='mensaje error'>Acción no válida.</div>";
}

function registrarAlumno($conn) {
    $campos_requeridos = ['nombre', 'fecha_nacimiento', 'curso', 'numero_de_control', 'poblacion', 'direccion', 'email', 'telefonos', 'curp'];
    foreach ($campos_requeridos as $campo) {
        if (!isset($_POST[$campo])) {
            echo "<div class='mensaje error'>El campo '$campo' es obligatorio.</div>";
            return;
        }
    }

    $nombre = $_POST['nombre'];
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $curso = $_POST['curso'];
    $numero_de_control = $_POST['numero_de_control'];
    $poblacion = $_POST['poblacion'];
    $direccion = $_POST['direccion'];
    $email = $_POST['email'];
    $telefonos = $_POST['telefonos'];
    $curp = $_POST['curp'];
    $estatus = $_POST['estatus'] ?? '';
    $alergico = $_POST['alergico'] ?? '';
    $contacto_accidente = $_POST['contacto_accidente'] ?? '';
    $telefonos_contacto = $_POST['telefono_contacto'] ?? '';
    $nombre_autorizado = $_POST['autorizado1'] ?? '';
    $curp_autorizado = $_POST['curp1'] ?? '';

    // Verificar si el número de control ya existe
    $sql_check = "SELECT id FROM alumnos WHERE numero_de_control = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $numero_de_control);
    $stmt_check->execute();
    $stmt_check->store_result();
    
    if ($stmt_check->num_rows > 0) {
        echo "<div class='mensaje error'>El número de control ya está registrado.</div>";
        $stmt_check->close();
        return;
    }
    $stmt_check->close();

    $sql = "INSERT INTO alumnos (
                numero_de_control, nombre, fecha_nacimiento, curso, poblacion, direccion,
                email, telefonos, curp, estatus, alergico, contacto_accidente,
                telefonos_contacto, nombre_autorizado, curp_autorizado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo "<div class='mensaje error'>Error al preparar la consulta: " . $conn->error . "</div>";
        return;
    }

    $stmt->bind_param(
        "sssssssssssssss",
        $numero_de_control, $nombre, $fecha_nacimiento, $curso, $poblacion, $direccion,
        $email, $telefonos, $curp, $estatus, $alergico, $contacto_accidente,
        $telefonos_contacto, $nombre_autorizado, $curp_autorizado
    );

    if ($stmt->execute()) {
        echo "<div class='mensaje exito'>Alumno registrado correctamente.</div>";
    } else {
        echo "<div class='mensaje error'>Error al registrar el alumno: " . $stmt->error . "</div>";
    }

    $stmt->close();
}

function buscarAlumno($conn) {
    if (!isset($_POST['numero_de_control']) ){
        echo "<div class='mensaje error'>Por favor, ingrese el número de control.</div>";
        return;
    }

    $numero_de_control = $_POST['numero_de_control'];

    $sql = "SELECT * FROM alumnos WHERE numero_de_control = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo "<div class='mensaje error'>Error al preparar la consulta: " . $conn->error . "</div>";
        return;
    }

    $stmt->bind_param("s", $numero_de_control);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $alumno = $result->fetch_assoc();
        echo "
        <div class='mensaje exito'>Alumno encontrado.</div>
        <div id='datos-alumno'>
            <h3>Datos del Alumno</h3>
            <p><strong>Nombre:</strong> {$alumno['nombre']}</p>
            <p><strong>Número de Control:</strong> {$alumno['numero_de_control']}</p>
            <p><strong>Fecha de Nacimiento:</strong> {$alumno['fecha_nacimiento']}</p>
            <p><strong>Curso:</strong> {$alumno['curso']}</p>
            <p><strong>Población:</strong> {$alumno['poblacion']}</p>
            <p><strong>Dirección:</strong> {$alumno['direccion']}</p>
            <p><strong>Email:</strong> {$alumno['email']}</p>
            <p><strong>Teléfonos:</strong> {$alumno['telefonos']}</p>
            <p><strong>CURP:</strong> {$alumno['curp']}</p>
            <p><strong>Estatus:</strong> {$alumno['estatus']}</p>
            <p><strong>Alergias:</strong> {$alumno['alergico']}</p>
            <p><strong>Contacto en emergencia:</strong> {$alumno['contacto_accidente']}</p>
            <p><strong>Teléfonos de emergencia:</strong> {$alumno['telefonos_contacto']}</p>
            <p><strong>Persona autorizada:</strong> {$alumno['nombre_autorizado']}</p>
            <p><strong>CURP autorizado:</strong> {$alumno['curp_autorizado']}</p>
        </div>";
    } else {
        echo "<div class='mensaje error'>Alumno no encontrado.</div>";
    }

    $stmt->close();
}

function actualizarAlumno($conn) {
    $campos_requeridos = ['nombre', 'fecha_nacimiento', 'curso', 'numero_de_control', 'poblacion', 'direccion', 'email', 'telefonos', 'curp'];
    foreach ($campos_requeridos as $campo) {
        if (!isset($_POST[$campo])) {
            echo "<div class='mensaje error'>El campo '$campo' es obligatorio.</div>";
            return;
        }
    }

    $nombre = $_POST['nombre'];
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $curso = $_POST['curso'];
    $numero_de_control = $_POST['numero_de_control'];
    $poblacion = $_POST['poblacion'];
    $direccion = $_POST['direccion'];
    $email = $_POST['email'];
    $telefonos = $_POST['telefonos'];
    $curp = $_POST['curp'];
    $estatus = $_POST['estatus'] ?? '';
    $alergico = $_POST['alergico'] ?? '';
    $contacto_accidente = $_POST['contacto_accidente'] ?? '';
    $telefonos_contacto = $_POST['telefono_contacto'] ?? '';
    $nombre_autorizado = $_POST['autorizado1'] ?? '';
    $curp_autorizado = $_POST['curp1'] ?? '';

    $sql = "UPDATE alumnos SET
                nombre = ?, fecha_nacimiento = ?, curso = ?, poblacion = ?, direccion = ?,
                email = ?, telefonos = ?, curp = ?, estatus = ?, alergico = ?,
                contacto_accidente = ?, telefonos_contacto = ?, nombre_autorizado = ?,
                curp_autorizado = ?
            WHERE numero_de_control = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo "<div class='mensaje error'>Error al preparar la consulta: " . $conn->error . "</div>";
        return;
    }

    $stmt->bind_param(
        "ssssssssssssss",
        $nombre, $fecha_nacimiento, $curso, $poblacion, $direccion,
        $email, $telefonos, $curp, $estatus, $alergico,
        $contacto_accidente, $telefonos_contacto, $nombre_autorizado, $curp_autorizado,
        $numero_de_control
    );

    if ($stmt->execute()) {
        echo "<div class='mensaje exito'>Datos actualizados correctamente.</div>";
    } else {
        echo "<div class='mensaje error'>Error al actualizar los datos: " . $stmt->error . "</div>";
    }

    $stmt->close();
}

function eliminarAlumno($conn) {
    if (!isset($_POST['numero_de_control'])) {
        echo "<div class='mensaje error'>Por favor, ingrese el número de control.</div>";
        return;
    }

    $numero_de_control = $_POST['numero_de_control'];

    // Buscar el alumno antes de eliminarlo
    $sql_select = "SELECT * FROM alumnos WHERE numero_de_control = ?";
    $stmt_select = $conn->prepare($sql_select);
    if (!$stmt_select) {
        echo "<div class='mensaje error'>Error al preparar la consulta: " . $conn->error . "</div>";
        return;
    }

    $stmt_select->bind_param("s", $numero_de_control);
    $stmt_select->execute();
    $result = $stmt_select->get_result();

    if ($result->num_rows > 0) {
        $alumno = $result->fetch_assoc();

        // Eliminar el alumno de la tabla principal
        $sql_delete = "DELETE FROM alumnos WHERE numero_de_control = ?";
        $stmt_delete = $conn->prepare($sql_delete);
        $stmt_delete->bind_param("s", $numero_de_control);

        if ($stmt_delete->execute()) {
            echo "<div class='mensaje exito'>Alumno eliminado correctamente.</div>";
        } else {
            echo "<div class='mensaje error'>Error al eliminar el alumno: " . $stmt_delete->error . "</div>";
        }

        $stmt_delete->close();
    } else {
        echo "<div class='mensaje error'>Alumno no encontrado.</div>";
    }

    $stmt_select->close();
}

$conn->close();
?>