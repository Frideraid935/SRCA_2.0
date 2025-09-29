 // Función para alternar entre los formularios
 document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const formId = item.getAttribute('data-form');

        // Ocultar todos los formularios
        document.querySelectorAll('.contenedor-formulario').forEach(form => {
            form.style.display = 'none';
        });

        // Mostrar el formulario correspondiente
        if (formId === 'buscar') {
            document.getElementById('form-buscar').style.display = 'block';
        } else if (formId === 'actualizar') {
            document.getElementById('form-actualizar').style.display = 'block';
        } else if (formId === 'inicio') {
            window.location.href = "../Menu_inicio/inicio_Alumno.html";
        }
    });
});

// Lógica para buscar alumno
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

// Lógica para buscar alumno en el formulario de actualización
document.getElementById('formulario-buscar-actualizar').addEventListener('submit', function(e) {
    e.preventDefault();

    const numeroControl = document.getElementById('actualizar-numero').value;

    fetch('../Controladores_Alumno/Buscar_Alumno.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_de_control: numeroControl })
    })
    .then(response => response.json())
    .then(data => {
        const mensajeDiv = document.getElementById('mensaje-actualizar');
        const formularioActualizar = document.getElementById('formulario-actualizar');

        if (data.status === "success") {
            const alumno = data.data;

            // Llenar el formulario con los datos del alumno
            document.getElementById('numero_de_control_actualizar').value = alumno.numero_de_control;
            document.getElementById('nombre').value = alumno.nombre;
            document.getElementById('fecha_nacimiento').value = alumno.fecha_nacimiento;
            document.getElementById('curso').value = alumno.curso;
            document.getElementById('poblacion').value = alumno.poblacion;
            document.getElementById('direccion').value = alumno.direccion;
            document.getElementById('email').value = alumno.email;
            document.getElementById('telefonos').value = alumno.telefonos;
            document.getElementById('curp').value = alumno.curp;
            document.getElementById('estatus').value = alumno.estatus;
            document.getElementById('alergico').value = alumno.alergico || '';
            document.getElementById('contacto_accidente').value = alumno.contacto_accidente || '';
            document.getElementById('telefonos_contacto').value = alumno.telefonos_contacto || '';
            document.getElementById('nombre_autorizado').value = alumno.nombre_autorizado || '';
            document.getElementById('curp_autorizado').value = alumno.curp_autorizado || '';

            formularioActualizar.style.display = 'block';
            mensajeDiv.style.display = 'none';
        } else {
            formularioActualizar.style.display = 'none';
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.textContent = data.message;
            mensajeDiv.style.display = 'block';
        }
    });
});

// Lógica para actualizar alumno
document.getElementById('formulario-actualizar').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('../Controladores_Alumno/Actualizar_Alumno.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        const mensajeDiv = document.getElementById('mensaje-actualizar');
        if (data.status === "success") {
            mensajeDiv.classList.add('mensaje-exito');
        } else {
            mensajeDiv.classList.add('mensaje-error');
        }
        mensajeDiv.textContent = data.message;
        mensajeDiv.style.display = 'block';
    });
});