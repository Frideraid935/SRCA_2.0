// Función para cambiar el formulario según la acción seleccionada
function cambiarFormulario(accion) {
    const titulo = document.getElementById('titulo-formulario');
    const botonAccion = document.getElementById('accion-btn');
    const formulario = document.getElementById('admin-form');

    if (accion === 'registrar') {
        titulo.textContent = 'Registrar Administrador';
        botonAccion.textContent = 'Registrar';
        botonAccion.className = 'btn btn-success';
        formulario.onsubmit = function (event) {
            event.preventDefault();
            registrarAdmin();
        };
    } else if (accion === 'eliminar') {
        titulo.textContent = 'Eliminar Administrador';
        botonAccion.textContent = 'Eliminar';
        botonAccion.className = 'btn btn-danger';
        formulario.onsubmit = function (event) {
            event.preventDefault();
            eliminarAdmin();
        };
    }
}

// Event listeners para los botones del menú lateral
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const accion = item.getAttribute('data-form');
        if (accion) {
            cambiarFormulario(accion);
        }

        // Marcar el menú como activo
        document.querySelectorAll('.menu-item').forEach(menuItem => {
            menuItem.classList.remove('active');
        });
        item.classList.add('active');
    });
});

// Función para registrar un administrador
function registrarAdmin() {
    const nombre = document.getElementById('nombre').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    if (!nombre || !contrasena) {
        mostrarMensaje('Todos los campos son obligatorios.', false);
        return;
    }

    // Simular registro (en una aplicación real, enviaría los datos al servidor)
    console.log('Administrador registrado:', { nombre, contrasena });
    mostrarMensaje('Administrador registrado exitosamente.', true);
    document.getElementById('admin-form').reset();
}

// Función para eliminar un administrador
function eliminarAdmin() {
    const nombre = document.getElementById('nombre').value.trim();

    if (!nombre) {
        mostrarMensaje('Ingrese el nombre del administrador a eliminar.', false);
        return;
    }

    // Simular eliminación (en una aplicación real, enviaría los datos al servidor)
    console.log('Administrador eliminado:', { nombre });
    mostrarMensaje(`Administrador "${nombre}" eliminado exitosamente.`, true);
    document.getElementById('admin-form').reset();
}

// Función para mostrar mensajes
function mostrarMensaje(texto, esExito) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = esExito ? 'mensaje-exito' : 'mensaje-error';
    mensaje.style.display = 'block';

    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 5000);
}

// Redirigir al menú principal
document.getElementById('btn-inicio').addEventListener('click', () => {
    window.location.href = '../Menu_inicio/inicio_Admin.html';
});