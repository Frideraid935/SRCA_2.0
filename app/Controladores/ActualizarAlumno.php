<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "crud";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$response = ["status" => "error", "message" => ""];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener los datos del formulario
    $id = $_POST['id']; // ID del alumno a actualizar
    $nombre = $_POST['nombre'];
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $curso = $_POST['curso'];
    $numero_de_control = $_POST['numero_de_control'];
    $poblacion = $_POST['poblacion'];
    $direccion = $_POST['direccion'];
    $email = $_POST['email'];
    $telefonos = $_POST['telefonos'];
    $curp = $_POST['curp'];
    $alergico = $_POST['alergico'];
    $contacto_accidente = $_POST['contacto_accidente'];
    $telefono_contacto = $_POST['telefono_contacto'];

    // Datos opcionales para los autorizados
    $autorizado1 = isset($_POST['autorizado1']) ? $_POST['autorizado1'] : null;
    $curp1 = isset($_POST['curp1']) ? $_POST['curp1'] : null;
    $autorizado2 = isset($_POST['autorizado2']) ? $_POST['autorizado2'] : null;
    $curp2 = isset($_POST['curp2']) ? $_POST['curp2'] : null;
    $autorizado3 = isset($_POST['autorizado3']) ? $_POST['autorizado3'] : null;
    $curp3 = isset($_POST['curp3']) ? $_POST['curp3'] : null;
    $autorizado4 = isset($_POST['autorizado4']) ? $_POST['autorizado4'] : null;
    $curp4 = isset($_POST['curp4']) ? $_POST['curp4'] : null;

    // Actualizar el alumno en la base de datos
    $sql = "UPDATE alumnos SET 
            nombre = '$nombre', 
            fecha_nacimiento = '$fecha_nacimiento', 
            curso = '$curso', 
            numero_de_control = '$numero_de_control', 
            poblacion = '$poblacion', 
            direccion = '$direccion', 
            email = '$email', 
            telefonos = '$telefonos', 
            curp = '$curp', 
            alergico = '$alergico', 
            accidente = '$contacto_accidente', 
            telefonos_contacto = '$telefono_contacto' 
            WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        $response["status"] = "success";
        $response["message"] = "Alumno actualizado con éxito.";

        // Actualizar los autorizados en la base de datos
        // Eliminamos primero los autorizados anteriores
        $conn->query("DELETE FROM autorizados WHERE alumno_id = $id");

        if ($autorizado1 && $curp1) {
            $sql_autorizado1 = "INSERT INTO autorizados (alumno_id, nombre, curp) VALUES ($id, '$autorizado1', '$curp1')";
            $conn->query($sql_autorizado1);
        }
        if ($autorizado2 && $curp2) {
            $sql_autorizado2 = "INSERT INTO autorizados (alumno_id, nombre, curp) VALUES ($id, '$autorizado2', '$curp2')";
            $conn->query($sql_autorizado2);
        }
        if ($autorizado3 && $curp3) {
            $sql_autorizado3 = "INSERT INTO autorizados (alumno_id, nombre, curp) VALUES ($id, '$autorizado3', '$curp3')";
            $conn->query($sql_autorizado3);
        }
        if ($autorizado4 && $curp4) {
            $sql_autorizado4 = "INSERT INTO autorizados (alumno_id, nombre, curp) VALUES ($id, '$autorizado4', '$curp4')";
            $conn->query($sql_autorizado4);
        }
    } else {
        $response["message"] = "Error al actualizar el alumno: " . $conn->error;
    }

    // Cerrar la conexión
    $conn->close();

    // Enviar respuesta en formato JSON
    echo json_encode($response);
}
?>
