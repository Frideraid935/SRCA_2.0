// Agrega un evento al formulario de búsqueda para interceptar su envío
document.getElementById('formulario-buscar').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtiene el valor del campo "número de control" del formulario
    const numeroControl = document.getElementById('numero_de_control').value;

    // Realiza una solicitud HTTP POST al servidor utilizando Fetch API
    fetch('../Controladores_Alumno/Buscar_Alumno.php', {
        method: 'POST', // Método HTTP POST
        headers: { 'Content-Type': 'application/json' }, // Indica que el contenido es JSON
        body: JSON.stringify({ numero_de_control: numeroControl }) // Envía el número de control en formato JSON
    })
    .then(response => response.json()) // Convierte la respuesta del servidor a JSON
    .then(data => {
        // Obtiene los elementos HTML necesarios para mostrar mensajes y el formulario de actualización
        const mensajeDiv = document.getElementById('mensaje-actualizar');
        const formularioActualizar = document.getElementById('formulario-actualizar');

        if (data.status === "success") {
            const alumno = data.data; // Datos del alumno obtenidos del servidor

            // Llena el formulario de actualización con los datos del alumno
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
            document.getElementById('alergico').value = alumno.alergico || ''; // Si el campo es nulo, asigna una cadena vacía
            document.getElementById('contacto_accidente').value = alumno.contacto_accidente || '';
            document.getElementById('telefonos_contacto').value = alumno.telefonos_contacto || '';
            document.getElementById('nombre_autorizado').value = alumno.nombre_autorizado || '';
            document.getElementById('curp_autorizado').value = alumno.curp_autorizado || '';

            // Muestra el formulario de actualización y oculta el mensaje de error
            formularioActualizar.style.display = 'block';
            mensajeDiv.style.display = 'none';
        } else {
            // Oculta el formulario de actualización y muestra un mensaje de error
            formularioActualizar.style.display = 'none';
            mensajeDiv.classList.add('mensaje-error'); // Añade una clase para estilizar el mensaje de error
            mensajeDiv.textContent = data.message; // Muestra el mensaje de error devuelto por el servidor
            mensajeDiv.style.display = 'block'; // Muestra el mensaje en la interfaz
        }
    });
});

// Agrega un evento al formulario de actualización para interceptar su envío
document.getElementById('formulario-actualizar').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Crea un objeto FormData con los datos del formulario
    const formData = new FormData(this);

    // Realiza una solicitud HTTP POST al servidor utilizando Fetch API
    fetch('../Controladores_Alumno/Actualizar_Alumno.php', {
        method: 'POST', // Método HTTP POST
        headers: { 'Content-Type': 'application/json' }, // Indica que el contenido es JSON
        body: JSON.stringify(Object.fromEntries(formData)) // Convierte los datos del formulario a un objeto JSON
    })
    .then(response => response.json()) // Convierte la respuesta del servidor a JSON
    .then(data => {
        // Obtiene el elemento HTML para mostrar mensajes
        const mensajeDiv = document.getElementById('mensaje-actualizar');

        if (data.status === "success") {
            mensajeDiv.classList.add('mensaje-exito'); // Añade una clase para estilizar el mensaje de éxito
        } else {
            mensajeDiv.classList.add('mensaje-error'); // Añade una clase para estilizar el mensaje de error
        }

        // Muestra el mensaje devuelto por el servidor
        mensajeDiv.textContent = data.message;
        mensajeDiv.style.display = 'block'; // Muestra el mensaje en la interfaz
    });
});