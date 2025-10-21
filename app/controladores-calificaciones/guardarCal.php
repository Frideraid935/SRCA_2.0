<?php
header('Content-Type: application/json');
mysqli_report(MYSQLI_REPORT_OFF); // Evita warnings automáticos

try {
    // 🔧 CONFIGURACIÓN DE BASE DE DATOS DESDE VARIABLES DE ENTORNO
    $servername = getenv("MYSQLHOST");
    $username   = getenv("MYSQLUSER");
    $password   = getenv("MYSQLPASSWORD");
    $dbname     = getenv("MYSQL_DATABASE");
    $port       = getenv("MYSQLPORT") ?: 3306;

    // 🔍 Validar que existan todas las variables
    if (!$servername || !$username || !$password || !$dbname) {
        throw new Exception(
            "Faltan variables de entorno de Railway. 
            Asegúrate de configurar MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQL_DATABASE y MYSQLPORT."
        );
    }

    // 🔌 Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    if ($conn->connect_error) {
        throw new Exception("Error de conexión con la base de datos: " . $conn->connect_error);
    }

    // 🔍 Verificar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido. Debes usar POST para enviar los datos.");
    }

    // 📦 Recibir datos (JSON o POST)
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $data = $_POST;
    }

    // 🧩 Asignar valores
    $alumno_nombre     = $data['alumno_nombre_ingresar'] ?? '';
    $numero_de_control = $data['numero_de_control_ingresar'] ?? '';
    $materia_id        = $data['materia_id_ingresar'] ?? 0;
    $calificacion      = $data['calificacion_ingresar'] ?? 0.0;
    $profesor_nombre   = $data['profesor_nombre_ingresar'] ?? '';

    // 🛠️ Validaciones de entrada
    $errores = [];
    if (empty($alumno_nombre)) $errores[] = "El nombre del alumno es obligatorio.";
    if (empty($numero_de_control) || strlen($numero_de_control) != 8) $errores[] = "Número de control inválido (debe tener 8 caracteres).";
    if ($materia_id <= 0) $errores[] = "El ID de la materia no es válido.";
    if ($calificacion < 0 || $calificacion > 10) $errores[] = "La calificación debe estar entre 0 y 10.";
    if (empty($profesor_nombre)) $errores[] = "El nombre del profesor es obligatorio.";

    if (!empty($errores)) {
        echo json_encode([
            "status" => "error",
            "message" => "Errores de validación detectados.",
            "errors" => $errores
        ]);
        exit;
    }

    // 🔍 Función para verificar existencia
    function existeRegistro($conn, $sql, $param, $tipo, $mensajeError)
    {
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar consulta: " . $conn->error);
        }
        $stmt->bind_param($tipo, $param);
        $stmt->execute();
        $result = $stmt->get_result();
        $existe = $result && $result->num_rows > 0;
        $stmt->close();
        return $existe ? true : $mensajeError;
    }

    // 🧾 Verificar existencia de alumno
    $alumnoExiste = existeRegistro(
        $conn,
        "SELECT id FROM alumnos WHERE numero_de_control = ?",
        $numero_de_control,
        "s",
        "El alumno no existe en la base de datos."
    );
    if ($alumnoExiste !== true) throw new Exception($alumnoExiste);

    // 📚 Verificar existencia de materia
    $materiaExiste = existeRegistro(
        $conn,
        "SELECT id FROM materias WHERE id = ?",
        $materia_id,
        "i",
        "La materia especificada no existe."
    );
    if ($materiaExiste !== true) throw new Exception($materiaExiste);

    // 👨‍🏫 Obtener ID del profesor
    $stmt_profesor = $conn->prepare("SELECT numero_de_control FROM profesores WHERE nombre = ?");
    if (!$stmt_profesor) throw new Exception("Error al preparar la consulta de profesor: " . $conn->error);
    $stmt_profesor->bind_param("s", $profesor_nombre);
    $stmt_profesor->execute();
    $result_profesor = $stmt_profesor->get_result();

    if ($result_profesor->num_rows === 0) {
        throw new Exception("El profesor especificado no existe en el sistema.");
    }

    $profesor_data = $result_profesor->fetch_assoc();
    $profesor_id = $profesor_data['numero_de_control'];
    $stmt_profesor->close();

    // 🧮 Insertar calificación
    $sql_insert = "INSERT INTO calificaciones 
                   (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                   VALUES (?, ?, ?, ?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);

    if (!$stmt_insert) {
        throw new Exception("Error al preparar la inserción: " . $conn->error);
    }

    $stmt_insert->bind_param("ssids", $alumno_nombre, $numero_de_control, $materia_id, $calificacion, $profesor_id);

    if (!$stmt_insert->execute()) {
        throw new Exception("Error al registrar la calificación: " . $stmt_insert->error);
    }

    echo json_encode([
        "status" => "success",
        "message" => "Calificación registrada correctamente.",
        "insert_id" => $stmt_insert->insert_id
    ]);

    $stmt_insert->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
