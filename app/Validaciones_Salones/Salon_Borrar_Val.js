// Escuchar evento 'submit' del formulario de eliminación de salón
document.getElementById('formulario-eliminar-salon').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir el envío tradicional del formulario

    // Obtener los valores ingresados por el usuario
    const salonId = document.getElementById('id').value.trim();
    
    // Obtener elementos del DOM donde se mostrarán resultados o mensajes
    const datosDiv = document.getElementById('datos-salon');
    const mensajeDiv = document.getElementById('mensaje-eliminar-salon');

    // Reiniciar la visualización de mensajes y datos previos
    datosDiv.style.display = 'none';
    mensajeDiv.style.display = 'none';
    mensajeDiv.className = '';
    mensajeDiv.textContent = '';

    // Validación: El ID es obligatorio
    if (!salonId) {
        mostrarMensaje('Por favor ingrese un ID de salón', false, mensajeDiv);
        return;
    }

    // Realizar petición al servidor para buscar el salón antes de eliminarlo
    fetch('../Controlador_Salon/buscar_salon.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${salonId}` // Enviar el ID como cuerpo de la solicitud
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Si se encontró el salón, obtener sus datos
            const salon = data.data[0];

            // Generar HTML con los datos del salón para mostrarlos al usuario
            datosDiv.innerHTML = `
                <div class="info-salon">
                    <h3>Datos del Salón</h3>
                    <p><strong>ID:</strong> ${salon.id}</p>
                    <p><strong>Nombre:</strong> ${salon.nombre}</p>
                    <p><strong>Capacidad:</strong> ${salon.capacidad}</p>
                    <p><strong>Profesor ID:</strong> ${salon.profesor_id}</p>
                </div>
                <div class="botones">
                    <button id="btn-confirmar-eliminacion" class="btn btn-danger">
                        <i class="fas fa-trash-alt"></i> Confirmar Eliminación
                    </button>
                </div>
            `;
            datosDiv.style.display = 'block'; // Mostrar datos del salón

            // Configurar evento de confirmación de eliminación
            document.getElementById('btn-confirmar-eliminacion').addEventListener('click', function () {
                if (confirm(`¿Está seguro que desea eliminar el salón "${salon.nombre}" (ID: ${salon.id})?`)) {
                    eliminarSalon(salonId, mensajeDiv, datosDiv);
                }
            });

        } else {
            // Mostrar mensaje si no se encontró el salón
            mostrarMensaje(data.message || 'Salón no encontrado', false, mensajeDiv);
        }
    })
    .catch(error => {
        // Capturar y mostrar errores durante la búsqueda
        console.error('Error:', error);
        mostrarMensaje('Error al buscar el salón', false, mensajeDiv);
    });
});

/**
 * Función que realiza la eliminación del salón en el servidor.
 * @param {string} id - ID del salón a eliminar
 * @param {HTMLElement} mensajeDiv - Elemento donde se mostrará el mensaje de resultado
 * @param {HTMLElement} datosDiv - Elemento que muestra los datos del salón
 */
function eliminarSalon(id, mensajeDiv, datosDiv) {
    fetch('../Controlador_Salon/Borrar_Salon.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar mensaje de resultado devuelto por el servidor
        mostrarMensaje(data.message, data.status === "success", mensajeDiv);

        if (data.status === "success") {
            // Ocultar datos del salón y reiniciar formulario
            datosDiv.style.display = 'none';
            document.getElementById('formulario-eliminar-salon').reset();
        }
    })
    .catch(error => {
        // Capturar y mostrar cualquier error durante la eliminación
        console.error('Error:', error);
        mostrarMensaje('Error al eliminar el salón', false, mensajeDiv);
    });
}

/**
 * Muestra un mensaje en pantalla con estilo de éxito o error.
 * @param {string} texto - El mensaje a mostrar
 * @param {boolean} esExito - true para mensaje de éxito, false para error
 * @param {HTMLElement} elemento - Elemento donde se mostrará el mensaje
 */
function mostrarMensaje(texto, esExito, elemento) {
    elemento.textContent = texto;
    elemento.className = esExito ? 'mensaje-exito' : 'mensaje-error';
    elemento.style.display = 'block';
}