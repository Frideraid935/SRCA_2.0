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

    // **********************************************
    // IMPLEMENTACIÓN DE ACTUALIZACIÓN DE CALIFICACIONES
    // **********************************************

    // Variables para almacenar la calificación actual
    let calificacionActual = null;

    // Buscar calificación por ID
    document.getElementById('btn-buscar-actualizar')?.addEventListener('click', async function() {
        const idCalificacion = document.getElementById('id_actualizar').value.trim();
        const btnBuscar = this;
        
        if (!idCalificacion) {
            mostrarMensaje('Por favor ingrese un ID de calificación', 'error', 'mensaje-actualizar');
            return;
        }
        
        // Mostrar estado de carga
        btnBuscar.disabled = true;
        btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        
        try {
            const response = await fetch(`../Controladores_Cal/obtenerCalificacion.php?id=${idCalificacion}`);
            
            if (!response.ok) {
                throw new Error('Error al buscar calificación');
            }
            
            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(data.message);
            }
            
            // Almacenar datos de la calificación
            calificacionActual = data.data;
            
            // Llenar el formulario con los datos
            document.getElementById('alumno_nombre_actualizar').value = calificacionActual.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = calificacionActual.numero_de_control;
            document.getElementById('materia_id_actualizar').value = calificacionActual.materia_id;
            document.getElementById('calificacion_actualizar').value = calificacionActual.calificacion;
            document.getElementById('profesor_nombre_actualizar').value = calificacionActual.profesor_nombre || '';
            
            // Mostrar el formulario de actualización
            document.getElementById('formulario-actualizar').style.display = 'block';
            mostrarMensaje('Calificación encontrada', 'success', 'mensaje-actualizar');
            
        } catch (error) {
            console.error('Error al buscar calificación:', error);
            mostrarMensaje(error.message, 'error', 'mensaje-actualizar');
            document.getElementById('formulario-actualizar').style.display = 'none';
        } finally {
            btnBuscar.disabled = false;
            btnBuscar.innerHTML = 'Buscar';
        }
    });

    // Actualizar calificación
    document.getElementById('btn-actualizar')?.addEventListener('click', async function() {
        const btnActualizar = this;
        
        if (!calificacionActual) {
            mostrarMensaje('Primero busque una calificación', 'error', 'mensaje-actualizar');
            return;
        }
        
        // Obtener valores del formulario
        const datosActualizacion = {
            id: calificacionActual.id,
            alumno_nombre: document.getElementById('alumno_nombre_actualizar').value.trim(),
            numero_de_control: document.getElementById('numero_de_control_actualizar').value.trim(),
            materia_id: document.getElementById('materia_id_actualizar').value,
            calificacion: document.getElementById('calificacion_actualizar').value,
            profesor_id: calificacionActual.profesor_id // Mantenemos el mismo profesor por simplicidad
        };
        
        // Validaciones
        if (!datosActualizacion.alumno_nombre || !datosActualizacion.numero_de_control || 
            !datosActualizacion.materia_id || !datosActualizacion.calificacion) {
            mostrarMensaje('Todos los campos son requeridos', 'error', 'mensaje-actualizar');
            return;
        }
        
        if (datosActualizacion.numero_de_control.length !== 8) {
            mostrarMensaje('El número de control debe tener 8 caracteres', 'error', 'mensaje-actualizar');
            return;
        }
        
        const calificacion = parseFloat(datosActualizacion.calificacion);
        if (isNaN(calificacion)) {
            mostrarMensaje('La calificación debe ser un número válido', 'error', 'mensaje-actualizar');
            return;
        }
        
        if (calificacion < 0 || calificacion > 10) {
            mostrarMensaje('La calificación debe estar entre 0 y 10', 'error', 'mensaje-actualizar');
            return;
        }
        
        // Mostrar estado de carga
        btnActualizar.disabled = true;
        btnActualizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        
        try {
            const response = await fetch('../Controladores_Cal/actualizarCalificacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosActualizacion)
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const resultado = await response.json();
            
            if (resultado.status === 'success') {
                mostrarMensaje(resultado.message, 'success', 'mensaje-actualizar');
                
                // Opcional: Resetear formulario después de 2 segundos
                setTimeout(() => {
                    document.getElementById('formulario-actualizar').reset();
                    document.getElementById('formulario-actualizar').style.display = 'none';
                    document.getElementById('id_actualizar').value = '';
                    calificacionActual = null;
                }, 2000);
            } else {
                throw new Error(resultado.message);
            }
        } catch (error) {
            console.error('Error al actualizar calificación:', error);
            mostrarMensaje(error.message, 'error', 'mensaje-actualizar');
        } finally {
            btnActualizar.disabled = false;
            btnActualizar.innerHTML = 'Actualizar';
        }
    });
});