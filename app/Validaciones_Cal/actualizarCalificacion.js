document.addEventListener('DOMContentLoaded', function() {
    console.log("Script de actualización de calificaciones cargado correctamente");
    
    // Variables globales
    let calificacionesAlumno = null;
    let calificacionSeleccionada = null;
    
    // Referencias a elementos del DOM
    const btnBuscar = document.getElementById('btn-buscar-actualizar');
    const btnActualizar = document.getElementById('btn-actualizar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formActualizar = document.getElementById('formulario-actualizar');
    const resultadosBusqueda = document.getElementById('resultados-busqueda');
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    const inputNumeroControl = document.getElementById('numero_control_buscar');

    // Función para mostrar mensajes al usuario
    function mostrarMensaje(mensaje, tipo = 'error', elementoId = 'mensaje-actualizar') {
        const mensajeDiv = document.getElementById(elementoId);
        if (!mensajeDiv) return;
        
        mensajeDiv.textContent = mensaje;
        mensajeDiv.className = `mensaje ${tipo}`;
        
        setTimeout(() => {
            mensajeDiv.textContent = '';
            mensajeDiv.className = 'mensaje';
        }, 5000);
    }

    // Función para procesar mensajes de error del servidor
    function procesarErrorServidor(textoRespuesta) {
        // Intentar extraer mensaje de error de HTML
        const errorMatch = textoRespuesta.match(/<b>(.*?)<\/b>/) || 
                          textoRespuesta.match(/error:(.*?)<br/i) ||
                          textoRespuesta.match(/exception:(.*?)<br/i);
        
        if (errorMatch) {
            return errorMatch[1].trim();
        }
        
        // Si es muy largo, devolver mensaje genérico
        return textoRespuesta.length > 100 ? 
               'Error en el servidor. Por favor intente más tarde.' : 
               textoRespuesta;
    }

    // Evento para buscar calificaciones
    btnBuscar.addEventListener('click', async function() {
        const numeroControl = inputNumeroControl.value.trim();
        
        if (numeroControl.length !== 8) {
            mostrarMensaje('El número de control debe tener 8 caracteres');
            return;
        }
        
        // Mostrar estado de carga
        this.disabled = true;
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        
        try {
            const response = await fetch(`../Controladores_Cal/obtenerCalificacionesPorControl.php?numero_control=${numeroControl}`);
            const responseText = await response.text();
            
            try {
                const data = JSON.parse(responseText);
                
                if (!response.ok || data.status === 'error') {
                    throw new Error(data.message || 'Error al obtener calificaciones');
                }
                
                // Almacenar y mostrar datos
                calificacionesAlumno = data.data;
                mostrarDatosAlumno();
                llenarTablaCalificaciones(calificacionesAlumno.calificaciones);
                
                resultadosBusqueda.style.display = 'block';
                mostrarMensaje(`${calificacionesAlumno.calificaciones.length} calificaciones encontradas`, 'success');
                
            } catch (jsonError) {
                console.error('Error parseando JSON:', jsonError);
                throw new Error(procesarErrorServidor(responseText));
            }
            
        } catch (error) {
            console.error('Error al buscar calificaciones:', error);
            mostrarMensaje(error.message);
            resultadosBusqueda.style.display = 'none';
            formActualizar.style.display = 'none';
        } finally {
            btnBuscar.disabled = false;
            btnBuscar.innerHTML = originalText;
        }
    });

    // Mostrar datos del alumno en el formulario
    function mostrarDatosAlumno() {
        if (!calificacionesAlumno) return;
        
        document.getElementById('alumno_nombre_actualizar').value = calificacionesAlumno.alumno_nombre;
        document.getElementById('numero_de_control_actualizar').value = calificacionesAlumno.numero_control;
    }

    // Llenar tabla de calificaciones
    function llenarTablaCalificaciones(calificaciones) {
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
                seleccionarCalificacion(this.getAttribute('data-id'));
            });
        });
    }

    // Seleccionar calificación para editar
    function seleccionarCalificacion(idCalificacion) {
        if (!calificacionesAlumno) return;

        calificacionSeleccionada = calificacionesAlumno.calificaciones.find(c => c.id == idCalificacion);

        if (!calificacionSeleccionada) {
            mostrarMensaje('Calificación no encontrada');
            return;
        }

        // Llenar formulario de edición
        document.getElementById('id_calificacion').value = calificacionSeleccionada.id;
        document.getElementById('materia_id_actualizar').value = calificacionSeleccionada.materia_id;
        document.getElementById('calificacion_actualizar').value = calificacionSeleccionada.calificacion;
        document.getElementById('profesor_nombre_actualizar').value = calificacionSeleccionada.profesor_nombre || '';

        // Mostrar formulario
        formActualizar.style.display = 'block';
        mostrarMensaje('Edite la calificación y haga clic en Actualizar', 'info');
    }

    // Evento para actualizar calificación
    btnActualizar.addEventListener('click', async function() {
        if (!calificacionSeleccionada) {
            mostrarMensaje('No hay calificación seleccionada');
            return;
        }

        // Obtener datos del formulario
        const datos = {
            id: document.getElementById('id_calificacion').value,
            alumno_nombre: document.getElementById('alumno_nombre_actualizar').value.trim(),
            numero_de_control: document.getElementById('numero_de_control_actualizar').value.trim(),
            materia_id: document.getElementById('materia_id_actualizar').value,
            calificacion: document.getElementById('calificacion_actualizar').value,
            profesor_id: calificacionSeleccionada.profesor_id
        };
        
        // Validar calificación
        const calificacion = parseFloat(datos.calificacion);
        if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
            mostrarMensaje('La calificación debe ser un número entre 0 y 10');
            return;
        }
        
        // Configurar estado de carga
        this.disabled = true;
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        
        try {
            const response = await fetch('../Controladores_Cal/actualizarCalificacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });
            
            const responseText = await response.text();
            
            try {
                const resultado = JSON.parse(responseText);
                
                if (!response.ok) {
                    throw new Error(resultado.message || 'Error en la actualización');
                }
                
                if (resultado.status === 'success') {
                    mostrarMensaje(resultado.message, 'success');
                    // Recargar datos después de 1.5 segundos
                    setTimeout(() => {
                        btnBuscar.click();
                        formActualizar.style.display = 'none';
                    }, 1500);
                } else {
                    throw new Error(resultado.message);
                }
            } catch (jsonError) {
                console.error('Error parseando JSON:', jsonError);
                throw new Error(procesarErrorServidor(responseText));
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            mostrarMensaje(error.message);
        } finally {
            this.disabled = false;
            this.innerHTML = originalText;
        }
    });

    // Evento para cancelar edición
    btnCancelar.addEventListener('click', function() {
        formActualizar.style.display = 'none';
    });
});