document.addEventListener('DOMContentLoaded', function() {
    const btnBuscar = document.getElementById('btn-buscar');
    const btnActualizar = document.getElementById('btn-actualizar');
    const formulario = document.getElementById('formulario-actualizar');
    const mensajeDiv = document.getElementById('mensaje');
    const idCalificacionInput = document.getElementById('id_calificacion');

    btnBuscar.addEventListener('click', buscarCalificacion);
    btnActualizar.addEventListener('click', actualizarCalificacion);

    function buscarCalificacion() {
        const id = idCalificacionInput.value.trim();
        
        if (!id) {
            mostrarMensaje('Por favor ingrese un ID de calificación', 'error');
            return;
        }

        // Mostrar carga
        btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        btnBuscar.disabled = true;
        mensajeDiv.textContent = '';
        mensajeDiv.className = 'mensaje';

        fetch(`../controladores-calificaciones/actualizar.php?action=buscar&id=${encodeURIComponent(id)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                llenarFormulario(data.data);
                formulario.style.display = 'block';
                mostrarMensaje('Calificación encontrada', 'exito');
            } else {
                throw new Error(data.error || 'No se encontró la calificación');
            }
        })
        .catch(error => {
            formulario.style.display = 'none';
            mostrarMensaje(error.message, 'error');
        })
        .finally(() => {
            btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar';
            btnBuscar.disabled = false;
        });
    }

    function llenarFormulario(datos) {
        document.getElementById('alumno_nombre').value = datos.alumno_nombre || '';
        document.getElementById('numero_control').value = datos.numero_control || '';
        document.getElementById('materia_id').value = datos.materia_id || '';
        document.getElementById('calificacion').value = datos.calificacion || '';
        document.getElementById('profesor_nombre').value = datos.profesor_nombre || '';
    }

    function actualizarCalificacion() {
        const id = idCalificacionInput.value.trim();
        if (!id) {
            mostrarMensaje('ID de calificación no válido', 'error');
            return;
        }

        // Validación adicional del lado del cliente
        const calificacion = parseFloat(document.getElementById('calificacion').value);
        if (calificacion < 0 || calificacion > 10) {
            mostrarMensaje('La calificación debe estar entre 0 y 10', 'error');
            return;
        }

        const formData = new FormData(formulario);
        const datos = Object.fromEntries(formData.entries());
        datos.id = id;

        // Mostrar carga
        btnActualizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        btnActualizar.disabled = true;
        mensajeDiv.textContent = '';
        mensajeDiv.className = 'mensaje';

        fetch('../controladores-calificaciones/actualizar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...datos, action: 'actualizar'})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mostrarMensaje('Calificación actualizada exitosamente', 'exito');
                
                // Notificar a la ventana principal
                window.parent.postMessage({
                    action: 'mostrarMensajeGlobal',
                    tipo: 'exito',
                    mensaje: 'Calificación actualizada exitosamente'
                }, '*');
            } else {
                throw new Error(data.error || 'Error al actualizar la calificación');
            }
        })
        .catch(error => {
            mostrarMensaje(error.message, 'error');
        })
        .finally(() => {
            btnActualizar.innerHTML = '<i class="fas fa-save"></i> Actualizar';
            btnActualizar.disabled = false;
        });
    }

    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = 'mensaje ' + tipo;
    }
});