// Función para mostrar/ocultar formularios
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const formToShow = item.getAttribute('data-form');
        document.querySelectorAll('.contenedor-formulario').forEach(form => {
            form.style.display = 'none';
        });
        document.getElementById(`form-${formToShow}`).style.display = 'block';

        // Marcar el menú como activo
        document.querySelectorAll('.menu-item').forEach(menuItem => {
            menuItem.classList.remove('active');
        });
        item.classList.add('active');
    });
});

// Función para guardar una nueva calificación
function guardarCalificacion() {
    const nombre = document.getElementById('alumno_nombre_ingresar').value;
    const control = document.getElementById('numero_de_control_ingresar').value;
    const materia = document.getElementById('materia_id_ingresar').value;
    const calificacion = document.getElementById('calificacion_ingresar').value;
    const profesor = document.getElementById('profesor_nombre_ingresar').value;

    if (!nombre || !control || !materia || !calificacion || !profesor) {
        mostrarMensaje("Todos los campos son obligatorios.", false, 'mensaje-ingresar');
        return;
    }

    mostrarMensaje("Calificación guardada exitosamente.", true, 'mensaje-ingresar');
}

// Función para buscar y cargar datos para actualizar
document.getElementById('btn-buscar-actualizar').addEventListener('click', () => {
    const id = document.getElementById('id_actualizar').value;
    if (!id) {
        mostrarMensaje("Ingrese un ID de calificación válido.", false, 'mensaje-actualizar');
        return;
    }

    // Simular búsqueda (en una app real haría petición al servidor)
    document.getElementById('formulario-actualizar').style.display = 'block';
    document.getElementById('alumno_nombre_actualizar').value = "Juan Pérez";
    document.getElementById('numero_de_control_actualizar').value = "20230001";
    document.getElementById('materia_id_actualizar').value = "101";
    document.getElementById('calificacion_actualizar').value = "8.5";
    document.getElementById('profesor_nombre_actualizar').value = "Dra. María López";

    mostrarMensaje("Datos cargados para edición.", true, 'mensaje-actualizar');
});

// Función para actualizar una calificación
function actualizarCalificacion() {
    const nombre = document.getElementById('alumno_nombre_actualizar').value;
    const control = document.getElementById('numero_de_control_actualizar').value;
    const materia = document.getElementById('materia_id_actualizar').value;
    const calificacion = document.getElementById('calificacion_actualizar').value;
    const profesor = document.getElementById('profesor_nombre_actualizar').value;

    if (!nombre || !control || !materia || !calificacion || !profesor) {
        mostrarMensaje("Todos los campos son obligatorios.", false, 'mensaje-actualizar');
        return;
    }

    mostrarMensaje("Calificación actualizada exitosamente.", true, 'mensaje-actualizar');
}
document.getElementById("btn-inicio").addEventListener("click", function() {
    window.location.href = "../Menu_inicio/inicio_profesor.html";
});
// Función para mostrar mensajes
function mostrarMensaje(texto, esExito, elementoId) {
    const mensaje = document.getElementById(elementoId);
    mensaje.textContent = texto;
    mensaje.className = esExito ? 'mensaje-exito' : 'mensaje-error';
    mensaje.style.display = 'block';
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 5000);
}