document.addEventListener('DOMContentLoaded', function() {
    // Evento para el botón de inicio
    document.getElementById('btn-inicio').addEventListener('click', function() {
        window.location.href = '../index.html'; // Ajusta la ruta según tu estructura
    });
});

function buscarCalificacion() {
    const numeroControl = document.getElementById('numero_de_control').value.trim();
    const mensajeDiv = document.getElementById('mensaje');
    const infoDiv = document.getElementById('info-calificacion');
    
    // Validación básica
    if (!numeroControl) {
        mostrarMensaje('Por favor ingrese un número de control', 'error');
        infoDiv.style.display = 'none';
        return;
    }

    if (numeroControl.length !== 8) {
        mostrarMensaje('El número de control debe tener 8 caracteres', 'error');
        infoDiv.style.display = 'none';
        return;
    }

    // Realizar la petición AJAX
    fetch(`../Controladores_Cal/obtenerCalificacionesPorControl.php?numero_control=${encodeURIComponent(numeroControl)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error' || data.status === 'info') {
                mostrarMensaje(data.message, data.status);
                infoDiv.style.display = 'none';
            } else if (data.status === 'success') {
                mostrarCalificaciones(data.data);
                mostrarMensaje('Calificaciones encontradas', 'success');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al conectar con el servidor', 'error');
            infoDiv.style.display = 'none';
        });
}

function mostrarCalificaciones(data) {
    const infoDiv = document.getElementById('info-calificacion');
    const calificaciones = data.calificaciones;
    
    // Mostrar información del estudiante (solo la primera vez)
    document.getElementById('info-estudiante').textContent = data.alumno_nombre;
    
    // Limpiar información previa de materias (si hubiera)
    document.getElementById('info-materia').textContent = '';
    document.getElementById('info-calificacion-valor').textContent = '';
    document.getElementById('info-profesor').textContent = '';
    
    // Mostrar todas las calificaciones
    calificaciones.forEach(cal => {
        document.getElementById('info-materia').textContent += `${cal.materia_nombre || 'N/A'}\n`;
        document.getElementById('info-calificacion-valor').textContent += `${cal.calificacion || 'N/A'}\n`;
        document.getElementById('info-profesor').textContent += `${cal.profesor_nombre || 'N/A'}\n`;
    });
    
    infoDiv.style.display = 'block';
}

function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = 'mensaje';
    
    switch(tipo) {
        case 'error':
            mensajeDiv.classList.add('error');
            break;
        case 'success':
            mensajeDiv.classList.add('success');
            break;
        case 'info':
            mensajeDiv.classList.add('info');
            break;
    }
}