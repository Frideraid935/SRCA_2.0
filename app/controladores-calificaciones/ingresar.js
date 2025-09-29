document.addEventListener('DOMContentLoaded', function() {
    console.log("Script de calificaciones cargado correctamente");
    
    // Manejo del envío del formulario
    const formIngresar = document.getElementById('formulario-ingresarP');
    
    if (formIngresar) {
        formIngresar.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar loader o indicador de carga
            const submitBtn = document.querySelector('#formulario-ingresarP button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            submitBtn.disabled = true;
            
            try {
                // Validación del número de control
                const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
                if (numeroControl.length !== 8) {
                    throw new Error('El número de control debe tener exactamente 8 caracteres');
                }
                
                // Validación de la calificación
                const calificacion = parseFloat(document.getElementById('calificacion_ingresar').value);
                if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
                    throw new Error('La calificación debe ser un número entre 0 y 10');
                }
                
                // Preparar datos para enviar
                const formData = new FormData(formIngresar);
                const jsonData = {};
                formData.forEach((value, key) => {
                    jsonData[key] = value;
                });
                
                // Enviar datos al servidor
                const response = await fetch('../controladores-calificaciones/guardarCal.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || 'Error en la respuesta del servidor');
                }
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    mostrarMensaje(data.message, 'success');
                    formIngresar.reset();
                    
                    // Opcional: Mostrar el ID insertado
                    console.log('ID de calificación insertada:', data.insert_id);
                } else {
                    throw new Error(data.message || 'Error al procesar la solicitud');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarMensaje(error.message, 'error');
            } finally {
                // Restaurar botón
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo, elementoId = 'mensaje-ingresar') {
        const mensajeDiv = document.getElementById(elementoId);
        if (!mensajeDiv) return;
        
        mensajeDiv.textContent = mensaje;
        mensajeDiv.className = `mensaje ${tipo}`;
        
        // Auto-ocultar mensaje después de 5 segundos
        setTimeout(() => {
            mensajeDiv.textContent = '';
            mensajeDiv.className = 'mensaje';
        }, 5000);
    }

    // Manejo del menú
    const menuItems = document.querySelectorAll('.menu-item');
    const forms = document.querySelectorAll('.contenedor-formulario');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const formToShow = this.getAttribute('data-form');
            
            // Actualizar menú
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar formularios
            forms.forEach(form => form.style.display = 'none');
            
            // Mostrar formulario correspondiente
            document.getElementById(`form-${formToShow}`).style.display = 'block';
        });
    });

    // Botón de inicio
    document.getElementById('btn-inicio')?.addEventListener('click', function() {
        window.location.href = '../Menu_inicio/inicio_profesor.html';
    });

});