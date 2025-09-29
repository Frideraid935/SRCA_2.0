// Función para mostrar mensajes dinámicos
function mostrarMensaje(texto, esExito) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = esExito ? 'mensaje-exito' : 'mensaje-error';
    mensaje.style.display = 'block';

    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 5000);
}

document.getElementById("btn-inicio").addEventListener("click", function() {
    window.location.href = "../Menu_inicio/inicio_Alumno.html";
});

// Función para buscar calificaciones
function buscarCalificacion() {
    const numeroControl = document.getElementById('numero_de_control').value.trim();

    // Validación básica
    if (!numeroControl) {
        mostrarMensaje("Por favor ingrese un número de control", false);
        return;
    }

    if (!/^\d{8}$/.test(numeroControl)) {
        mostrarMensaje("El número de control debe contener exactamente 8 números", false);
        return;
    }

    // Realizar petición AJAX al servidor PHP
    fetch(`../controladores-calificaciones/buscar_calif_alum.php?numero_de_control=${encodeURIComponent(numeroControl)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const infoCalificacion = document.getElementById('info-calificacion');
            
            if (data.error) {
                limpiarInformacion();
                mostrarMensaje(data.error, false);
                return;
            }

            // Mostrar información del estudiante
            document.getElementById('info-estudiante').textContent = data.estudiante;
            
            if (data.calificaciones && data.calificaciones.length > 0) {
                // Crear tabla de calificaciones
                crearTablaCalificaciones(data.calificaciones);
                mostrarMensaje("Información encontrada", true);
            } else {
                limpiarInformacion();
                mostrarMensaje("El alumno no tiene calificaciones registradas", false);
            }
            
            infoCalificacion.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje("Error al consultar las calificaciones", false);
        });
}

// Función para limpiar la información mostrada
function limpiarInformacion() {
    document.getElementById('info-estudiante').textContent = "N/A";
    const infoMateria = document.getElementById('info-materia');
    infoMateria.innerHTML = "N/A";
    document.getElementById('info-calificacion-valor').textContent = "N/A";
    document.getElementById('info-profesor').textContent = "N/A";
    
    const tablaExistente = document.getElementById('tabla-calificaciones');
    if (tablaExistente) tablaExistente.remove();
}

// Función para crear la tabla de calificaciones
function crearTablaCalificaciones(calificaciones) {
    // Eliminar tabla existente si hay una
    const tablaExistente = document.getElementById('tabla-calificaciones');
    if (tablaExistente) tablaExistente.remove();

    // Crear elementos de la tabla
    const tabla = document.createElement('table');
    tabla.id = 'tabla-calificaciones';
    tabla.className = 'tabla-calificaciones';

    // Crear encabezados de la tabla
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Materia', 'Calificación', 'Profesor'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    
    calificaciones.forEach(calif => {
        const row = document.createElement('tr');
        
        const materiaCell = document.createElement('td');
        materiaCell.textContent = calif.materia_nombre || 'N/A';
        row.appendChild(materiaCell);
        
        const califCell = document.createElement('td');
        califCell.textContent = calif.calificacion || 'N/A';
        row.appendChild(califCell);
        
        const profesorCell = document.createElement('td');
        profesorCell.textContent = calif.profesor_nombre || 'N/A';
        row.appendChild(profesorCell);
        
        tbody.appendChild(row);
    });
    
    tabla.appendChild(tbody);

    // Insertar la tabla en el contenedor de información
    const infoMateria = document.getElementById('info-materia');
    infoMateria.innerHTML = ''; // Limpiar contenido anterior
    infoMateria.appendChild(tabla);

    // Actualizar otros campos informativos
    document.getElementById('info-calificacion-valor').textContent = calificaciones.length + " registros";
    document.getElementById('info-profesor').textContent = "Varios profesores";
}