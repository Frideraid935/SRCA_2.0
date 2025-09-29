document.addEventListener('DOMContentLoaded', function() {
    const formBuscar = document.getElementById('form-buscar-admin');
    const btnEliminar = document.getElementById('btn-confirmar-eliminar');
    
    formBuscar.addEventListener('submit', function(e) {
        e.preventDefault();
        buscarAdmin();
    });
    
    btnEliminar.addEventListener('click', function() {
        eliminarAdmin();
    });
});

async function buscarAdmin() {
    const usuario = document.getElementById('usuario').value.trim();
    const mensaje = document.getElementById('mensaje');
    const infoAdmin = document.getElementById('info-admin');

    if (!usuario) {
        mostrarMensaje(mensaje, 'Ingrese el nombre de usuario a buscar', 'error');
        return;
    }

    try {
        mostrarMensaje(mensaje, 'Buscando administrador...', 'info');
        
        const response = await fetch('../Controladores_admin/buscar_admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario: usuario })
        });

        const data = await response.json();

        if (data.status === 'success') {
            document.getElementById('info-usuario').textContent = data.admin.usuario;
            infoAdmin.style.display = 'block';
            mostrarMensaje(mensaje, 'Administrador encontrado', 'success');
        } else {
            infoAdmin.style.display = 'none';
            mostrarMensaje(mensaje, data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(mensaje, 'Error al conectar con el servidor', 'error');
    }
}

async function eliminarAdmin() {
    const usuario = document.getElementById('usuario').value.trim();
    const mensaje = document.getElementById('mensaje');

    try {
        mostrarMensaje(mensaje, 'Eliminando administrador...', 'info');
        
        const response = await fetch('../Controladores_admin/eliminar_admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario: usuario })
        });

        const data = await response.json();

        if (data.status === 'success') {
            mostrarMensaje(mensaje, data.message, 'success');
            document.getElementById('form-buscar-admin').reset();
            document.getElementById('info-admin').style.display = 'none';
        } else {
            mostrarMensaje(mensaje, data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(mensaje, 'Error al conectar con el servidor', 'error');
    }
}

function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `mensaje ${tipo}`;
    elemento.style.display = 'block';

    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}