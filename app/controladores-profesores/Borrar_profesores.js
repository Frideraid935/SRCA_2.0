/**
 * Muestra un mensaje en pantalla (éxito o error) en el elemento especificado.
 * @param {string} texto - El mensaje a mostrar.
 * @param {boolean} esExito - Si true, se muestra como éxito; si false, como error.
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

// Asigna evento 'click' al botón de búsqueda de profesor para eliminar
document.getElementById('btn-buscar-eliminar').addEventListener('click', buscarProfesorParaEliminar);

/**
 * Busca un profesor por su número de control para mostrar sus datos antes de eliminarlo.
 */
function buscarProfesorParaEliminar() {
    const numeroControl = document.getElementById('eliminar-numero').value.trim();
    const datosProfesor = document.getElementById('datos-profesor');
    const infoProfesor = document.getElementById('info-profesor');
    const btnEliminar = document.getElementById('btn-eliminar-confirmar');

    // Validación: Número de control no puede estar vacío
    if (!numeroControl) {
        mostrarMensaje("Ingrese un número de control", false, 'mensaje-eliminar');
        datosProfesor.style.display = 'none';
        btnEliminar.style.display = 'none';
        return;
    }

    // Validación: Formato correcto (8 dígitos)
    if (!/^\d{8}$/.test(numeroControl)) {
        mostrarMensaje("El número de control debe tener 8 dígitos", false, 'mensaje-eliminar');
        datosProfesor.style.display = 'none';
        btnEliminar.style.display = 'none';
        return;
    }

    // Realiza una solicitud fetch al servidor para buscar al profesor
    fetch(`../controladores-profesores/buscar_profesores.php?numero_de_control=${encodeURIComponent(numeroControl)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                // Mostrar mensaje de error si el profesor no existe
                mostrarMensaje(data.error, false, 'mensaje-eliminar');
                datosProfesor.style.display = 'none';
                btnEliminar.style.display = 'none';
                return;
            }

            // Generar tabla HTML con los datos del profesor
            let html = `
                <table class="tabla-profesor">
                    <tr><th>Número de Control</th><td>${data.numero_de_control || 'N/A'}</td></tr>
                    <tr><th>Nombre</th><td>${data.nombre || 'N/A'}</td></tr>
                    <tr><th>Especialidad</th><td>${data.especialidad || 'N/A'}</td></tr>
                </table>
            `;

            // Insertar tabla en el DOM e indicar que se encontró al profesor
            infoProfesor.innerHTML = html;
            datosProfesor.style.display = 'block';
            btnEliminar.style.display = 'block';

            // Configurar evento de confirmación de eliminación
            btnEliminar.onclick = function () {
                if (confirm(`¿Está seguro que desea eliminar al profesor ${data.nombre} (${data.numero_de_control})?\nEsta acción no se puede deshacer.`)) {
                    eliminarProfesor(data.numero_de_control, data.nombre);
                }
            };

            // Mostrar mensaje informativo
            mostrarMensaje("Profesor encontrado. Revise los datos antes de eliminar.", true, 'mensaje-eliminar');
        })
        .catch(error => {
            // Manejar errores durante la solicitud
            console.error('Error:', error);
            mostrarMensaje("Error al buscar el profesor", false, 'mensaje-eliminar');
            datosProfesor.style.display = 'none';
            btnEliminar.style.display = 'none';
        });
}

/**
 * Elimina un profesor mediante una solicitud al servidor.
 * @param {string} numeroControl - Número de control del profesor a eliminar.
 * @param {string} nombreProfesor - Nombre del profesor para mostrar en mensajes.
 */
function eliminarProfesor(numeroControl, nombreProfesor) {
    fetch(`../controladores-profesores/borrar_profesores.php?numero_de_control=${encodeURIComponent(numeroControl)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Mensaje de éxito tras eliminar
                mostrarMensaje(`Profesor ${nombreProfesor} (${numeroControl}) eliminado correctamente.`, true, 'mensaje-eliminar');

                // Limpiar formulario y ocultar elementos relacionados
                document.getElementById('eliminar-numero').value = '';
                document.getElementById('datos-profesor').style.display = 'none';
                document.getElementById('btn-eliminar-confirmar').style.display = 'none';
            } else {
                // Mostrar mensaje de error devuelto por el servidor
                mostrarMensaje(data.error || "Error al eliminar el profesor", false, 'mensaje-eliminar');
            }
        })
        .catch(error => {
            // Manejar errores durante la conexión con el servidor
            console.error('Error:', error);
            mostrarMensaje("Error al conectar con el servidor", false, 'mensaje-eliminar');
        });
}