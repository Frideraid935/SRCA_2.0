// Asigna un evento 'click' al botón con ID 'btn-buscar'
// Cuando se hace clic, se ejecuta la función 'buscarProfesor'
document.getElementById('btn-buscar').addEventListener('click', buscarProfesor);

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
 * Función principal que realiza la búsqueda de un profesor por número de control.
 * Valida los datos, realiza una solicitud fetch al servidor y muestra los resultados.
 */
function buscarProfesor() {
    // Obtener el valor ingresado en el campo de número de control y limpiar espacios
    const numeroControl = document.getElementById('busqueda-numero').value.trim();

    // Elementos del DOM donde se mostrarán los resultados
    const resultados = document.getElementById('resultados-busqueda');
    const datosProfesor = document.getElementById('datos-profesor');

    // Validación: El campo no puede estar vacío
    if (!numeroControl) {
        mostrarMensaje("Ingrese un número de control", false, 'mensaje-busqueda');
        return;
    }

    // Validación: Formato correcto (8 dígitos)
    if (!/^\d{8}$/.test(numeroControl)) {
        mostrarMensaje("El número de control debe tener 8 dígitos", false, 'mensaje-busqueda');
        return;
    }

    // Realiza una petición fetch al servidor para buscar al profesor
    fetch(`../controladores-profesores/buscar_profesores.php?numero_de_control=${encodeURIComponent(numeroControl)}`)
        .then(response => response.json())
        .then(data => {
            // Si el servidor devuelve un error
            if (data.error) {
                mostrarMensaje(data.error, false, 'mensaje-busqueda');
                resultados.style.display = 'none';
                return;
            }

            // Generar tabla HTML con los datos del profesor encontrado
            let html = `
                <table class="tabla-profesor">
                    <tr><th>Número de Control</th><td>${data.numero_de_control}</td></tr>
                    <tr><th>Nombre</th><td>${data.nombre}</td></tr>
                    <tr><th>Especialidad</th><td>${data.especialidad}</td></tr>
                </table>
            `;

            // Insertar tabla en el DOM e indicar que se encontró al profesor
            datosProfesor.innerHTML = html;
            resultados.style.display = 'block';

            // Mostrar mensaje de éxito
            mostrarMensaje("Profesor encontrado", true, 'mensaje-busqueda');
        })
        .catch(error => {
            // Capturar y mostrar cualquier error durante la petición
            console.error('Error:', error);
            mostrarMensaje("Error al buscar el profesor", false, 'mensaje-busqueda');
        });
}