// Asigna un evento 'click' al botón de buscar profesor para actualizar
document.getElementById('btn-buscar-actualizar').addEventListener('click', buscarProfesorParaActualizar);

/**
 * Muestra un mensaje en pantalla (éxito o error) en el elemento especificado.
 * @param {string} texto - El mensaje a mostrar.
 * @param {boolean} esExito - Si es true, muestra como éxito; si false, como error.
 * @param {string} elementoId - ID del elemento donde se mostrará el mensaje.
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
 * Busca un profesor por su número de control para poder editarlo.
 * Realiza validaciones y una petición fetch al servidor.
 */
function buscarProfesorParaActualizar() {
    const numeroControl = document.getElementById('actualizar-numero').value.trim();
    const formulario = document.getElementById('formulario-actualizar');

    // Validación: Campo vacío
    if (!numeroControl) {
        mostrarMensaje("Ingrese un número de control", false, 'mensaje-actualizar');
        return;
    }

    // Validación: Formato correcto (8 dígitos)
    if (!/^\d{8}$/.test(numeroControl)) {
        mostrarMensaje("El número de control debe tener 8 dígitos", false, 'mensaje-actualizar');
        return;
    }

    // Petición Fetch al backend para buscar el profesor
    fetch(`../controladores-profesores/buscar_profesores.php?numero_de_control=${encodeURIComponent(numeroControl)}`)
        .then(response => response.json())
        .then(data => {
            // Si hay un error devuelto por el servidor
            if (data.error) {
                mostrarMensaje(data.error, false, 'mensaje-actualizar');
                formulario.style.display = 'none'; // Ocultar formulario
                return;
            }

            // Llenar campos del formulario con los datos obtenidos
            document.getElementById('numero_original').value = data.numero_de_control;
            document.getElementById('nombre_actualizar').value = data.nombre || '';
            document.getElementById('especialidad_actualizar').value = data.especialidad || '';

            // Mostrar formulario para editar
            formulario.style.display = 'block';

            // Mostrar mensaje de éxito
            mostrarMensaje("Profesor encontrado. Puede actualizar los datos.", true, 'mensaje-actualizar');
        })
        .catch(error => {
            // Capturar y mostrar errores en la petición
            console.error('Error:', error);
            mostrarMensaje("Error al buscar el profesor", false, 'mensaje-actualizar');
        });
}

/**
 * Actualiza los datos del profesor mediante una solicitud POST al servidor.
 */
function actualizarProfesor() {
    const numeroOriginal = document.getElementById('numero_original').value;
    const nombre = document.getElementById('nombre_actualizar').value.trim();
    const especialidad = document.getElementById('especialidad_actualizar').value.trim();

    // Validación: Campos obligatorios no pueden estar vacíos
    if (!nombre || !especialidad) {
        mostrarMensaje("Todos los campos son obligatorios", false, 'mensaje-actualizar');
        return;
    }

    // Preparar los datos del formulario para enviarlos al servidor
    const formData = new FormData();
    formData.append('numero_original', numeroOriginal);
    formData.append('nombre', nombre);
    formData.append('especialidad', especialidad);

    // Enviar datos al servidor usando método POST
    fetch('../controladores-profesores/actualizar_profesores.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Manejar respuesta del servidor
        if (data.success) {
            mostrarMensaje(data.message, true, 'mensaje-actualizar');
        } else {
            mostrarMensaje(data.error, false, 'mensaje-actualizar');
        }
    })
    .catch(error => {
        // Capturar y mostrar errores en la petición
        console.error('Error:', error);
        mostrarMensaje("Error al actualizar el profesor", false, 'mensaje-actualizar');
    });
}