// Escuchar evento 'submit' del formulario de búsqueda de salones
document.getElementById('formulario-buscar-salon').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir el envío tradicional del formulario

    // Obtener elementos del DOM
    const idInput = document.getElementById('id');              // Campo de entrada del ID del salón
    const idValue = idInput.value.trim();                       // Valor ingresado por el usuario
    const mensajeDiv = document.getElementById('mensaje-busqueda-salon'); // Para mostrar mensajes al usuario
    const resultadosDiv = document.getElementById('resultados-busqueda-salon'); // Contenedor de resultados
    const datosSalon = document.getElementById('datos-salon');  // Donde se mostrarán los datos del salón o listado

    // Limpiar estados anteriores
    mensajeDiv.className = '';                  // Resetear clase de mensaje
    mensajeDiv.style.display = 'none';          // Ocultar mensaje
    mensajeDiv.textContent = '';                // Vaciar texto
    resultadosDiv.style.display = 'none';       // Ocultar resultados previos
    datosSalon.innerHTML = '';                  // Limpiar datos mostrados

    // Realizar petición fetch al servidor para buscar salón(es)
    fetch('../Controlador_Salon/buscar_salon.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${idValue}` // Enviar el ID como cuerpo de la solicitud
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            resultadosDiv.style.display = 'block'; // Mostrar contenedor de resultados

            if (idValue) {
                // Caso individual: Se buscó un salón específico
                const salon = data.data[0];
                datosSalon.innerHTML = `
                    <div class="info-salon">
                        <p><strong>ID:</strong> ${salon.id}</p>
                        <p><strong>Nombre:</strong> ${salon.nombre}</p>
                        <p><strong>Capacidad:</strong> ${salon.capacidad}</p>
                        <p><strong>Profesor:</strong> ${salon.profesor_nombre || 'No asignado'} 
                           (ID: ${salon.profesor_id || 'N/A'})</p>
                    </div>
                `;
                mostrarMensaje('✅ Salón encontrado con éxito', true, mensajeDiv);
            } else {
                // Caso general: No se proporcionó ID, se devuelven todos los salones
                data.data.forEach(salon => {
                    const salonDiv = document.createElement('div');
                    salonDiv.className = 'info-salon';
                    salonDiv.innerHTML = `
                        <hr>
                        <p><strong>ID:</strong> ${salon.id}</p>
                        <p><strong>Nombre:</strong> ${salon.nombre}</p>
                        <p><strong>Capacidad:</strong> ${salon.capacidad}</p>
                        <p><strong>Profesor:</strong> ${salon.profesor_nombre || 'No asignado'} 
                           (ID: ${salon.profesor_id || 'N/A'})</p>
                    `;
                    datosSalon.appendChild(salonDiv);
                });
                mostrarMensaje('✅ Mostrando todos los salones registrados', true, mensajeDiv);
            }

        } else {
            // Mostrar mensaje si no se encontraron salones o hubo error
            mostrarMensaje(data.message || 'Error al buscar salones', false, mensajeDiv);
        }
    })
    .catch(error => {
        // Capturar y mostrar errores durante la conexión
        console.error('Error:', error);
        mostrarMensaje('Error en la conexión con el servidor', false, mensajeDiv);
    });
});

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