/**
 * Muestra un mensaje de éxito o error en pantalla durante un tiempo limitado.
 * @param {string} texto - El mensaje a mostrar.
 * @param {boolean} esExito - Indica si el mensaje es de éxito (true) o error (false).
 * @param {string} elementoId - ID del elemento HTML donde se mostrará el mensaje.
 */
function mostrarMensaje(texto, esExito, elementoId) {
    const mensaje = document.getElementById(elementoId);
    mensaje.textContent = texto;
    mensaje.className = esExito ? 'mensaje-exito' : 'mensaje-error';
    mensaje.style.display = 'block';

    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 5000);
}

/**
 * Función que recoge los datos del formulario, realiza validaciones y envía
 * una solicitud al servidor para guardar un nuevo profesor mediante la API REST.
 */
function guardarProfesor() {
    const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
    const nombre = document.getElementById('nombre_ingresar').value.trim();
    const especialidad = document.getElementById('especialidad_ingresar').value.trim();

    // Validaciones
    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje("Todos los campos son obligatorios", false, 'mensaje-ingresar');
        return;
    }

    if (!/^\d{8}$/.test(numeroControl)) {
        mostrarMensaje("El número de control debe tener 8 dígitos", false, 'mensaje-ingresar');
        return;
    }

    // Preparar JSON
    const datos = {
        numero_de_control: numeroControl,
        nombre: nombre,
        especialidad: especialidad
        
    };

    // Enviar al servidor usando fetch API
    fetch('http://localhost:8080/controladores-profesores/api_profesores.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            mostrarMensaje(data.message, true, 'mensaje-ingresar');
            document.getElementById('formulario-ingresar').reset();
        } else {
            mostrarMensaje(data.message || "Error al guardar el profesor", false, 'mensaje-ingresar');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarMensaje("Error al conectar con el servidor", false, 'mensaje-ingresar');
    });
}
