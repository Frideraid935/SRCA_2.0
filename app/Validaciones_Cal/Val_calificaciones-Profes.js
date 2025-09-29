document.addEventListener('DOMContentLoaded', function() {
    console.log("Script de calificaciones cargado correctamente");
    
    // Variables globales
    let calificacionesAlumno = null;
    let calificacionSeleccionada = null;
    
    // Manejo del envío del formulario de ingreso
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
                const response = await fetch('../Controladores_Cal/guardarCal.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData)
                });
                
                // Verificar el tipo de contenido primero
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(text || 'El servidor respondió con un formato inesperado');
                }
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Error en la respuesta del servidor');
                }
                
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
            
            // Limpiar resultados anteriores al cambiar de formulario
            if (formToShow === 'actualizar') {
                document.getElementById('resultados-busqueda').style.display = 'none';
                document.getElementById('formulario-actualizar').style.display = 'none';
                document.getElementById('numero_control_buscar').value = '';
                calificacionesAlumno = null;
                calificacionSeleccionada = null;
            }
        });
    });

    // Botón de inicio
    document.getElementById('btn-inicio')?.addEventListener('click', function() {
        window.location.href = '../Menu_inicio/inicio_Admin.html';
    });

    // **********************************************
    // IMPLEMENTACIÓN DE ACTUALIZACIÓN DE CALIFICACIONES
    // **********************************************

    // Buscar calificaciones por número de control
    document.getElementById('btn-buscar-actualizar')?.addEventListener('click', async function() {
        const numeroControl = document.getElementById('numero_control_buscar').value.trim();
        const btnBuscar = this;
        
        if (numeroControl.length !== 8) {
            mostrarMensaje('El número de control debe tener 8 caracteres', 'error', 'mensaje-actualizar');
            return;
        }
        
        // Mostrar estado de carga
        btnBuscar.disabled = true;
        btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        
        try {
            const response = await fetch(`../Controladores_Cal/obtenerCalificacionesPorControl.php?numero_control=${numeroControl}`);
            
            // Verificar el tipo de contenido primero
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(text || 'El servidor respondió con un formato inesperado');
            }
            
            const data = await response.json();
            
            if (!response.ok || data.status === 'error' || data.status === 'info') {
                throw new Error(data.message || 'Error al buscar calificaciones');
            }
            
            // Almacenar datos del alumno y sus calificaciones
            calificacionesAlumno = data.data;
            
            // Mostrar datos del alumno
            document.getElementById('alumno_nombre_actualizar').value = calificacionesAlumno.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = calificacionesAlumno.numero_control;
            
            // Llenar la tabla de calificaciones
            llenarTablaCalificaciones(calificacionesAlumno.calificaciones);
            
            // Mostrar resultados
            document.getElementById('resultados-busqueda').style.display = 'block';
            mostrarMensaje(`${calificacionesAlumno.calificaciones.length} calificaciones encontradas`, 'success', 'mensaje-actualizar');
            
        } catch (error) {
            console.error('Error al buscar calificaciones:', error);
            
            // Mensaje de error mejorado
            let errorMessage = error.message;
            if (error.message.includes('Unexpected token')) {
                errorMessage = 'Error en el formato de respuesta del servidor';
            }
            
            mostrarMensaje(errorMessage, 'error', 'mensaje-actualizar');
            document.getElementById('resultados-busqueda').style.display = 'none';
            document.getElementById('formulario-actualizar').style.display = 'none';
        } finally {
            btnBuscar.disabled = false;
            btnBuscar.innerHTML = 'Buscar Calificaciones';
        }
    });

    // Función para llenar la tabla de calificaciones
    function llenarTablaCalificaciones(calificaciones) {
        const cuerpoTabla = document.getElementById('cuerpo-tabla');
        cuerpoTabla.innerHTML = '';
        
        calificaciones.forEach(calificacion => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${calificacion.id}</td>
                <td>${calificacion.materia_nombre || 'ID: ' + calificacion.materia_id}</td>
                <td>${calificacion.calificacion}</td>
                <td>${calificacion.profesor_nombre || 'ID: ' + calificacion.profesor_id}</td>
                <td>
                    <button class="btn-editar" data-id="${calificacion.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
        
        // Agregar event listeners a los botones de editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const idCalificacion = this.getAttribute('data-id');
                seleccionarCalificacion(idCalificacion);
            });
        });
    }

    // Función para seleccionar una calificación para editar
    function seleccionarCalificacion(idCalificacion) {
        if (!calificacionesAlumno) return;

        calificacionSeleccionada = calificacionesAlumno.calificaciones.find(c => c.id == idCalificacion);

        if (!calificacionSeleccionada) {
            mostrarMensaje('Calificación no encontrada', 'error', 'mensaje-actualizar');
            return;
        }

        // Llenar formulario de edición
        document.getElementById('id_calificacion').value = calificacionSeleccionada.id;
        document.getElementById('alumno_nombre_actualizar').value = calificacionesAlumno.alumno_nombre;
        document.getElementById('numero_de_control_actualizar').value = calificacionesAlumno.numero_control;
        document.getElementById('materia_id_actualizar').value = calificacionSeleccionada.materia_id;
        document.getElementById('calificacion_actualizar').value = calificacionSeleccionada.calificacion;
        document.getElementById('profesor_nombre_actualizar').value = calificacionSeleccionada.profesor_nombre || '';

        // Mostrar formulario de edición
        document.getElementById('formulario-actualizar').style.display = 'block';
        mostrarMensaje('Edite la calificación y haga clic en Actualizar', 'info', 'mensaje-actualizar');

        // Agregar event listener si no existe
        const btnActualizar = document.getElementById('btn-actualizar');
        if (btnActualizar && !btnActualizar.dataset.listenerAdded) {
            btnActualizar.addEventListener('click', actualizarCalificacion);
            btnActualizar.dataset.listenerAdded = "true";
        }
    }
});