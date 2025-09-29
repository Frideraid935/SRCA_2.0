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
    mensaje.style.display = 'block'; // Mostrar mensaje

    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 5000);
}

/**
 * Función que recoge los datos del formulario, realiza validaciones y envía una solicitud
 * al servidor para guardar un nuevo profesor.
 */
function guardarProfesor() {
    // Obtener valores de los campos del formulario y limpiar espacios extra
    const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
    const nombre = document.getElementById('nombre_ingresar').value.trim();
    const especialidad = document.getElementById('especialidad_ingresar').value.trim();

    // Validación: Todos los campos son obligatorios
    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje("Todos los campos son obligatorios", false, 'mensaje-ingresar');
        return;
    }

    // Validación: El número de control debe tener exactamente 8 dígitos
    if (!/^\d{8}$/.test(numeroControl)) {
        mostrarMensaje("El número de control debe tener 8 dígitos", false, 'mensaje-ingresar');
        return;
    }

    // Preparar los datos del formulario para enviarlos al servidor
    const formData = new FormData();
    formData.append('numero_de_control', numeroControl);
    formData.append('nombre', nombre);
    formData.append('especialidad', especialidad);

    // Enviar los datos al servidor mediante una solicitud POST
    fetch('../controladores-profesores/ingresar_profesores.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Si la operación fue exitosa, mostrar mensaje de éxito y limpiar el formulario
            mostrarMensaje(data.message, true, 'mensaje-ingresar');
            document.getElementById('formulario-ingresar').reset();
        } else {
            // Si hubo un error desde el servidor, mostrar mensaje de error
            mostrarMensaje(data.error, false, 'mensaje-ingresar');
        }
    })
    .catch(error => {
        // Capturar y mostrar cualquier error durante la conexión con el servidor
        console.error('Error:', error);
        mostrarMensaje("Error al guardar el profesor", false, 'mensaje-ingresar');
    });
}