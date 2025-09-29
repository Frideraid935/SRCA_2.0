document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('form-registrar-admin');
    
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        
        // Validaciones básicas
        if (!usuario || !contrasena) {
            mostrarMensaje('Todos los campos son obligatorios', 'error');
            return;
        }
        
        if (contrasena.length < 4) {
            mostrarMensaje('La contraseña debe tener al menos 8 caracteres', 'error');
            return;
        }
        
        try {
            // Mostrar carga
            mostrarMensaje('Registrando administrador...', 'info');
            
            // Enviar datos al servidor
            const respuesta = await registrarAdministrador(usuario, contrasena);
            
            if (respuesta.status === 'success') {
                mostrarMensaje(respuesta.message, 'success');
                formulario.reset();
            } else {
                mostrarMensaje(respuesta.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al conectar con el servidor', 'error');
        }
    });
});

async function registrarAdministrador(usuario, contrasena) {
    const datos = {
        usuario: usuario,
        contrasena: contrasena
    };
    
    const respuesta = await fetch('../Controladores_admin/guardar_admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    return await respuesta.json();
}

function mostrarMensaje(texto, tipo) {
    const elementoMensaje = document.getElementById('mensaje');
    elementoMensaje.textContent = texto;
    elementoMensaje.className = `mensaje ${tipo}`;
    elementoMensaje.style.display = 'block';
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        elementoMensaje.style.display = 'none';
    }, 5000);
}