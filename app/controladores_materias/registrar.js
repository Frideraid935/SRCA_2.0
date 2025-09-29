document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario-ingresar');
    
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = document.getElementById('materia-id').value.trim();
        const nombre = document.getElementById('materia-nombre').value.trim();
        const mensaje = document.getElementById('mensaje-ingresar');
        
        if (!nombre) {
            mostrarMensaje(mensaje, 'El nombre es obligatorio', 'error');
            return;
        }
        
        try {
            const data = { nombre: nombre };
            
            // Solo agregar ID si se especificó
            if (id) {
                if (!/^\d+$/.test(id)) {
                    throw new Error('El ID debe ser un número entero');
                }
                data.id = parseInt(id);
            }
            
            const respuesta = await registrarMateria(data);
            
            if (respuesta.success) {
                mostrarMensaje(mensaje, `Materia registrada con ID: ${respuesta.id}`, 'success');
                formulario.reset();
            } else {
                mostrarMensaje(mensaje, respuesta.message, 'error');
            }
        } catch (error) {
            mostrarMensaje(mensaje, error.message, 'error');
            console.error('Error:', error);
        }
    });
});

async function registrarMateria(data) {
    const response = await fetch('../controladores_materias/registrar_materia.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
}

function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `mensaje ${tipo}`;
    elemento.style.display = 'block';
    
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}