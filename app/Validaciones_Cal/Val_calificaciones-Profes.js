document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Script de calificaciones cargado correctamente");

    let calificacionesAlumno = null;
    let calificacionSeleccionada = null;

    // ================================
    // 🔹 MENÚ LATERAL: Cambiar formulario visible
    // ================================
    const menuItems = document.querySelectorAll('.menu-item');
    const formularios = document.querySelectorAll('.contenedor-formulario');

    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            const formToShow = this.getAttribute('data-form');

            // Activar/desactivar item del menú
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            // Mostrar solo el formulario correspondiente
            formularios.forEach(f => f.style.display = 'none');
            const formElement = document.getElementById(`form-${formToShow}`);
            if (formElement) formElement.style.display = 'block';

            // Limpiar resultados si se va a actualizar
            if (formToShow === 'actualizar') {
                document.getElementById('resultados-busqueda').style.display = 'none';
                document.getElementById('formulario-actualizar').style.display = 'none';
                document.getElementById('numero_control_buscar').value = '';
                calificacionesAlumno = null;
                calificacionSeleccionada = null;
            }
        });
    });

    // ================================
    // 🔹 ENVÍO DE FORMULARIO: INGRESAR CALIFICACIÓN
    // ================================
    const formIngresar = document.getElementById('formulario-ingresarP');
    if (formIngresar) {
        formIngresar.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = formIngresar.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            submitBtn.disabled = true;

            try {
                const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
                const calificacion = parseFloat(document.getElementById('calificacion_ingresar').value);

                if (numeroControl.length !== 8) throw new Error('El número de control debe tener exactamente 8 caracteres.');
                if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) throw new Error('La calificación debe ser un número entre 0 y 10.');

                const formData = new FormData(formIngresar);
                const jsonData = {};
                formData.forEach((value, key) => jsonData[key] = value);

                const response = await fetch('../Controladores_Cal/guardarCal.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jsonData)
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(text || 'El servidor respondió con un formato inesperado.');
                }

                const data = await response.json();
                if (data.status === 'success') {
                    mostrarMensaje(data.message, 'success', 'mensaje-ingresar');
                    formIngresar.reset();
                    console.log('✅ Calificación insertada con ID:', data.insert_id);
                } else {
                    const mensajeError = data.errors ? data.errors.join('\n') : data.message;
                    throw new Error(mensajeError || 'Error al registrar la calificación.');
                }
            } catch (error) {
                console.error('❌ Error:', error);
                mostrarMensaje(error.message, 'error', 'mensaje-ingresar');
            } finally {
                submitBtn.innerHTML = originalText;
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

            // Llenar campos generales
            document.getElementById('alumno_nombre_actualizar').value = calificacionesAlumno.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = calificacionesAlumno.numero_control;

            // Llenar tabla
            llenarTablaCalificaciones(calificacionesAlumno.calificaciones);

            document.getElementById('resultados-busqueda').style.display = 'block';
            mostrarMensaje(`${calificacionesAlumno.calificaciones.length} calificaciones encontradas`, 'success', 'mensaje-actualizar');
        } catch (error) {
            console.error('Error al buscar calificaciones:', error);
            mostrarMensaje(error.message, 'error', 'mensaje-actualizar');
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

        calificaciones.forEach(cal => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cal.id}</td>
                <td>${cal.materia_nombre || 'ID: ' + cal.materia_id}</td>
                <td>${cal.calificacion}</td>
                <td>${cal.profesor_nombre || 'ID: ' + cal.profesor_id}</td>
                <td>
                    <button class="btn-editar" data-id="${cal.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });

        // Botones editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function () {
                const idCal = this.getAttribute('data-id');
                seleccionarCalificacion(idCal);
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
    // 🔹 BOTÓN ACTUALIZAR CALIFICACIÓN
    // ================================
    document.getElementById('btn-actualizar')?.addEventListener('click', async function () {
        if (!calificacionSeleccionada) {
            mostrarMensaje('Seleccione una calificación para actualizar', 'error', 'mensaje-actualizar');
            return;
        }

        const submitBtn = this;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        submitBtn.disabled = true;

        try {
            const calificacionNueva = parseFloat(document.getElementById('calificacion_actualizar').value);
            if (isNaN(calificacionNueva) || calificacionNueva < 0 || calificacionNueva > 10) {
                throw new Error('La calificación debe ser un número entre 0 y 10.');
            }

            const jsonData = {
                id: calificacionSeleccionada.id,
                calificacion: calificacionNueva
            };

            const response = await fetch('../Controladores_Cal/actualizarCal.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData)
            });

            const data = await response.json();
            if (data.status === 'success') {
                mostrarMensaje(data.message, 'success', 'mensaje-actualizar');
                document.getElementById('formulario-actualizar').style.display = 'none';
                document.getElementById('resultados-busqueda').style.display = 'none';
            } else {
                throw new Error(data.message || 'Error al actualizar la calificación.');
            }
        } catch (error) {
            console.error(error);
            mostrarMensaje(error.message, 'error', 'mensaje-actualizar');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // ================================
    // 🔹 BOTÓN CANCELAR ACTUALIZACIÓN
    // ================================
    document.getElementById('btn-cancelar')?.addEventListener('click', function () {
        document.getElementById('formulario-actualizar').style.display = 'none';
        mostrarMensaje('Actualización cancelada', 'info', 'mensaje-actualizar');
    });

    // ================================
    // 🔹 FUNCIÓN PARA MOSTRAR MENSAJES
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

    // ================================
    // 🔹 BOTÓN DE INICIO
    // ================================
    document.getElementById('btn-inicio')?.addEventListener('click', function () {
        window.location.href = '../Menu_inicio/inicio_Admin.html';
    });
});
