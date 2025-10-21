document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Script de calificaciones cargado correctamente");

    // ================================
    // 🔹 ENVÍO DE FORMULARIO: INGRESAR CALIFICACIÓN
    // ================================
    const formIngresar = document.getElementById('formulario-ingresarP');

    if (formIngresar) {
        formIngresar.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Botón de carga
            const submitBtn = formIngresar.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            submitBtn.disabled = true;

            try {
                // 📋 Validaciones antes del envío
                const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
                const calificacion = parseFloat(document.getElementById('calificacion_ingresar').value);

                if (numeroControl.length !== 8) {
                    throw new Error('El número de control debe tener exactamente 8 caracteres.');
                }

                if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
                    throw new Error('La calificación debe ser un número entre 0 y 10.');
                }

                // 🔄 Recolectar datos del formulario
                const formData = new FormData(formIngresar);
                const jsonData = {};
                formData.forEach((value, key) => {
                    jsonData[key] = value;
                });

                // 🌐 Enviar solicitud al servidor (PHP)
                const response = await fetch('../controladores-calificaciones/guardarCal.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });

                // 🧠 Verificar que el servidor responda JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(text || 'El servidor respondió con un formato inesperado.');
                }

                const data = await response.json();

                // 🔍 Procesar respuesta del servidor
                if (data.status === 'success') {
                    mostrarMensaje(data.message, 'success');
                    console.log('✅ Calificación insertada con ID:', data.insert_id);
                    formIngresar.reset();
                } else if (data.status === 'error') {
                    const mensajeError = data.errors ? data.errors.join('\n') : data.message;
                    throw new Error(mensajeError || 'Error al registrar la calificación.');
                } else {
                    throw new Error('Respuesta inesperada del servidor.');
                }

            } catch (error) {
                console.error('❌ Error:', error);
                mostrarMensaje(error.message, 'error');
            } finally {
                // 🔁 Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ================================
    // 🔹 FUNCIÓN PARA MOSTRAR MENSAJES
    // ================================
    function mostrarMensaje(mensaje, tipo, id = 'mensaje-ingresar') {
        const mensajeDiv = document.getElementById(id);
        if (!mensajeDiv) return;

        mensajeDiv.textContent = mensaje;
        mensajeDiv.className = `mensaje ${tipo}`;

        // Desaparecer el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeDiv.textContent = '';
            mensajeDiv.className = 'mensaje';
        }, 5000);
    }

    // ================================
    // 🔹 BOTÓN DE REGRESAR AL MENÚ
    // ================================
    document.getElementById('btn-inicio')?.addEventListener('click', function () {
        window.location.href = '../Menu_inicio/inicio_Admin.html';
    });
});
