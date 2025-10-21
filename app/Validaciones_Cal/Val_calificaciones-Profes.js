document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Script de calificaciones cargado correctamente");

    let calificacionesAlumno = null;
    let calificacionSeleccionada = null;

    // ================================
    // 🔹 FORMULARIO: INGRESAR CALIFICACIÓN
    // ================================
    const formIngresar = document.getElementById('formulario-ingresarP');
    if (formIngresar) {
        formIngresar.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = document.querySelector('#formulario-ingresarP button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            submitBtn.disabled = true;

            try {
                const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
                if (numeroControl.length !== 8) throw new Error('El número de control debe tener exactamente 8 caracteres');

                const calificacion = parseFloat(document.getElementById('calificacion_ingresar').value);
                if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) throw new Error('La calificación debe ser un número entre 0 y 10');

                const formData = new FormData(formIngresar);
                const jsonData = {};
                formData.forEach((value, key) => { jsonData[key] = value; });

                const response = await fetch('../Controladores_Cal/guardarCal.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jsonData)
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(text || 'El servidor respondió con un formato inesperado');
                }

                const data = await response.json();

                if (data.status === 'success') {
                    mostrarMensaje(data.message, 'success', 'mensaje-ingresar');
                    formIngresar.reset();
                    console.log('ID de calificación insertada:', data.insert_id);
                } else {
                    throw new Error(data.message || 'Error al procesar la solicitud');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarMensaje(error.message, 'error', 'mensaje-ingresar');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ================================
    // 🔹 BÚSQUEDA DE CALIFICACIONES PARA ACTUALIZAR
    // ================================
    document.getElementById('btn-buscar-actualizar')?.addEventListener('click', async function () {
        const numeroControl = document.getElementById('numero_control_buscar').value.trim();
        const btnBuscar = this;

        if (numeroControl.length !== 8) {
            mostrarMensaje('El número de control debe tener 8 caracteres', 'error', 'mensaje-actualizar');
            return;
        }

        btnBuscar.disabled = true;
        btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';

        try {
            const response = await fetch(`../Controladores_Cal/obtenerCalificacionesPorControl.php?numero_control=${numeroControl}`);
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(text || 'El servidor respondió con un formato inesperado');
            }

            const data = await response.json();

            if (!response.ok || data.status === 'error' || data.status === 'info') {
                throw new Error(data.message || 'Error al buscar calificaciones');
            }

            calificacionesAlumno = data.data;

            document.getElementById('alumno_nombre_actualizar').value = calificacionesAlumno.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = calificacionesAlumno.numero_control;

            llenarTablaCalificaciones(calificacionesAlumno.calificaciones);

            document.getElementById('resultados-busqueda').style.display = 'block';
            mostrarMensaje(`${calificacionesAlumno.calificaciones.length} calificaciones encontradas`, 'success', 'mensaje-actualizar');

        } catch (error) {
            console.error('Error al buscar calificaciones:', error);
            const errorMessage = error.message.includes('Unexpected token') ? 'Error en el formato de respuesta del servidor' : error.message;
            mostrarMensaje(errorMessage, 'error', 'mensaje-actualizar');
            document.getElementById('resultados-busqueda').style.display = 'none';
            document.getElementById('formulario-actualizar').style.display = 'none';
        } finally {
            btnBuscar.disabled = false;
            btnBuscar.innerHTML = 'Buscar Calificaciones';
        }
    });

    // ================================
    // 🔹 LLENAR TABLA DE CALIFICACIONES
    // ================================
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

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function () {
                const idCalificacion = this.getAttribute('data-id');
                seleccionarCalificacion(idCalificacion);
            });
        });
    }

    // ================================
    // 🔹 SELECCIONAR CALIFICACIÓN PARA EDITAR
    // ================================
    function seleccionarCalificacion(idCalificacion) {
        if (!calificacionesAlumno) return;

        calificacionSeleccionada = calificacionesAlumno.calificaciones.find(c => c.id == idCalificacion);
        if (!calificacionSeleccionada) {
            mostrarMensaje('Calificación no encontrada', 'error', 'mensaje-actualizar');
            return;
        }

        document.getElementById('id_calificacion').value = calificacionSeleccionada.id;
        document.getElementById('alumno_nombre_actualizar').value = calificacionesAlumno.alumno_nombre;
        document.getElementById('numero_de_control_actualizar').value = calificacionesAlumno.numero_control;
        document.getElementById('materia_id_actualizar').value = calificacionSeleccionada.materia_id;
        document.getElementById('calificacion_actualizar').value = calificacionSeleccionada.calificacion;
        document.getElementById('profesor_nombre_actualizar').value = calificacionSeleccionada.profesor_nombre || '';

        document.getElementById('formulario-actualizar').style.display = 'block';
        mostrarMensaje('Edite la calificación y haga clic en Actualizar', 'info', 'mensaje-actualizar');
    }

    // ================================
    // 🔹 BOTÓN DE ACTUALIZAR CALIFICACIÓN
    // ================================
    const btnActualizar = document.getElementById('btn-actualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async function () {
            if (!calificacionSeleccionada) {
                mostrarMensaje('Seleccione una calificación para actualizar', 'error', 'mensaje-actualizar');
                return;
            }
            const formActualizar = document.getElementById('formulario-actualizar');
            await manejarFormulario(formActualizar, '../Controladores_Cal/actualizarCal.php', 'actualizar');
        });
    }

    // ================================
    // 🔹 BOTÓN DE CANCELAR ACTUALIZACIÓN
    // ================================
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function () {
            document.getElementById('formulario-actualizar').style.display = 'none';
            mostrarMensaje('Actualización cancelada', 'info', 'mensaje-actualizar');
        });
    }

    // ================================
    // 🔹 FUNCION PARA MOSTRAR MENSAJES
    // ================================
    function mostrarMensaje(mensaje, tipo, id) {
        const mensajeDiv = document.getElementById(id);
        if (!mensajeDiv) return;

        mensajeDiv.textContent = mensaje;
        mensajeDiv.className = `mensaje ${tipo}`;

        setTimeout(() => {
            mensajeDiv.textContent = '';
            mensajeDiv.className = 'mensaje';
        }, 5000);
    }
});
