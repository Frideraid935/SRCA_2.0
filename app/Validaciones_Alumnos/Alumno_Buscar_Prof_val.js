document.getElementById('formulario-buscar').addEventListener('submit', function(e) {
    e.preventDefault();

    const numeroControl = document.getElementById('busqueda-numero').value;

    fetch('../Controladores_Alumno/Buscar_Alumno.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_de_control: numeroControl })
    })
    .then(response => response.json())
    .then(data => {
        const resultadosDiv = document.getElementById('resultados-busqueda');
        const mensajeDiv = document.getElementById('mensaje-busqueda');

        if (data.status === "success") {
            const alumno = data.data;

            // Mostrar los datos del alumno
            resultadosDiv.style.display = 'block';
            mensajeDiv.style.display = 'none';

            document.getElementById('datos-alumno').innerHTML = `
                <p><strong>Nombre:</strong> ${alumno.nombre}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${alumno.fecha_nacimiento}</p>
                <p><strong>Curso:</strong> ${alumno.curso}</p>
                <p><strong>Población:</strong> ${alumno.poblacion}</p>
                <p><strong>Dirección:</strong> ${alumno.direccion}</p>
                <p><strong>Email:</strong> ${alumno.email}</p>
                <p><strong>Teléfonos:</strong> ${alumno.telefonos}</p>
                <p><strong>CURP:</strong> ${alumno.curp}</p>
                <p><strong>Estatus:</strong> ${alumno.estatus}</p>
                <p><strong>Alergias:</strong> ${alumno.alergico || 'N/A'}</p>
                <p><strong>Contacto en caso de accidente:</strong> ${alumno.contacto_accidente || 'N/A'}</p>
                <p><strong>Teléfonos de Contacto:</strong> ${alumno.telefonos_contacto || 'N/A'}</p>
                <p><strong>Nombre Autorizado:</strong> ${alumno.nombre_autorizado || 'N/A'}</p>
                <p><strong>CURP Autorizado:</strong> ${alumno.curp_autorizado || 'N/A'}</p>
            `;
        } else {
            resultadosDiv.style.display = 'none';
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.textContent = data.message;
            mensajeDiv.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const mensajeDiv = document.getElementById('mensaje-busqueda');
        mensajeDiv.classList.add('mensaje-error');
        mensajeDiv.textContent = 'Ocurrió un error al buscar el alumno.';
        mensajeDiv.style.display = 'block';
    });
});

// Redirigir al menú principal
document.getElementById('btn-inicio').addEventListener('click', function() {
    window.location.href = "../Menu_inicio/inicio_profesor.html";
});