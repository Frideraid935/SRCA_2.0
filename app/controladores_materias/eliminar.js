document.addEventListener('DOMContentLoaded', function() {
    const formBuscar = document.getElementById('form-buscar-materia');
    const formEliminar = document.getElementById('form-confirmar-eliminar');
    const mensaje = document.getElementById('mensaje-eliminar');
    const infoMateria = document.getElementById('info-materia');
    
    let materiaActual = null;

    // Buscar materia por ID
    formBuscar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = document.getElementById('buscar-id').value.trim();
        
        if (!id) {
            mostrarMensaje(mensaje, 'Ingrese un ID para buscar', 'error');
            return;
        }
        
        try {
            mostrarMensaje(mensaje, 'Buscando materia...', 'info');
            
            const respuesta = await buscarMateria(id);
            
            if (respuesta.success) {
                materiaActual = respuesta.materia;
                mostrarInfoMateria(materiaActual);
                mostrarMensaje(mensaje, 'Materia encontrada', 'success');
            } else {
                ocultarInfoMateria();
                mostrarMensaje(mensaje, respuesta.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje(mensaje, 'Error al buscar la materia', 'error');
        }
    });

    // Confirmar eliminación
    formEliminar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!materiaActual) {
            mostrarMensaje(mensaje, 'Primero busque una materia válida', 'error');
            return;
        }
        
        try {
            mostrarMensaje(mensaje, 'Eliminando materia...', 'info');
            
            const respuesta = await eliminarMateria(materiaActual.id);
            
            if (respuesta.success) {
                mostrarMensaje(mensaje, respuesta.message, 'success');
                formBuscar.reset();
                ocultarInfoMateria();
                materiaActual = null;
            } else {
                mostrarMensaje(mensaje, respuesta.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje(mensaje, 'Error al eliminar la materia', 'error');
        }
    });

    // Mostrar información de la materia encontrada
    function mostrarInfoMateria(materia) {
        document.getElementById('info-id').textContent = materia.id;
        document.getElementById('info-nombre').textContent = materia.nombre;
        infoMateria.style.display = 'block';
    }

    // Ocultar panel de información
    function ocultarInfoMateria() {
        infoMateria.style.display = 'none';
    }
});

// Función para buscar materia por ID
async function buscarMateria(id) {
    const response = await fetch(`../controladores_materias/buscar_materia.php?id=${encodeURIComponent(id)}`);
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
}

// Función para eliminar materia (sin contraseña)
async function eliminarMateria(id) {
    const response = await fetch('../controladores_materias/eliminar_materia.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        })
    });
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
}

// Mostrar mensajes al usuario
function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `mensaje ${tipo}`;
    elemento.style.display = 'block';
    
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}