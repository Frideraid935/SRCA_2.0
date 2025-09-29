// Función para mostrar/ocultar formularios
function mostrarFormulario(id) {
    const formularios = document.querySelectorAll('.formulario-materia');
    formularios.forEach(form => form.style.display = 'none');
    document.getElementById(id).style.display = 'block';

    // Marcar el menú como activo
    const links = document.querySelectorAll('.menu-item');
    links.forEach(link => link.classList.remove('active'));
    document.querySelector(`.menu-item[data-form="${id}"]`).classList.add('active');
}

// Event listeners para los botones del menú lateral
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const formToShow = item.getAttribute('data-form');
        if (formToShow) {
            mostrarFormulario(formToShow);
        }
    });
});

// Redirigir al menú principal
document.getElementById('btn-inicio').addEventListener('click', () => {
    window.location.href = '../Menu_inicio/inicio_Admin.html';
});

// Función para registrar una materia
document.getElementById('formulario-ingresar').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('materia-nombre').value.trim();
    const codigo = document.getElementById('materia-codigo').value.trim();
    const creditos = document.getElementById('materia-creditos').value.trim();

    if (!nombre || !codigo || !creditos) {
        mostrarMensaje("Todos los campos son obligatorios.", false, 'mensaje-ingresar');
        return;
    }

    // Simular registro (en una aplicación real, enviaría los datos al servidor)
    console.log("Materia registrada:", { nombre, codigo, creditos });
    mostrarMensaje("Materia registrada exitosamente.", true, 'mensaje-ingresar');
    this.reset();
});

// Función para eliminar una materia
document.getElementById('formulario-eliminar').addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = document.getElementById('materia-codigo-eliminar').value.trim();
    const confirmarContraseña = document.getElementById('confirmar-eliminar').value.trim();

    if (!codigo || !confirmarContraseña) {
        mostrarMensaje("Todos los campos son obligatorios.", false, 'mensaje-eliminar');
        return;
    }

    // Simular eliminación (en una aplicación real, enviaría los datos al servidor)
    console.log("Materia eliminada:", { codigo, confirmarContraseña });
    mostrarMensaje("Materia eliminada exitosamente.", true, 'mensaje-eliminar');
    this.reset();
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