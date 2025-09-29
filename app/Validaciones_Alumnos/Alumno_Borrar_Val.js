// Agrega un evento al formulario de eliminación para interceptar su envío
document.getElementById('formulario-eliminar').addEventListener('submit', function(e) {
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
        // Obtiene los elementos HTML necesarios para mostrar los datos del alumno y mensajes
        const datosAlumnoDiv = document.getElementById('datos-alumno');
        const mensajeDiv = document.getElementById('mensaje-eliminar');

        if (data.status === "success") {
            const alumno = data.data; // Datos del alumno obtenidos del servidor

            // Muestra los datos del alumno en el contenedor "datos-alumno" usando HTML dinámico
            datosAlumnoDiv.innerHTML = `
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
                <button id="btn-confirmar-eliminacion" class="btn btn-danger">Confirmar Eliminación</button>
            `;
            datosAlumnoDiv.style.display = 'block'; // Muestra el contenedor de datos del alumno
            mensajeDiv.style.display = 'none'; // Oculta el mensaje de error

            // Agrega un evento al botón de confirmación de eliminación
            document.getElementById('btn-confirmar-eliminacion').addEventListener('click', function() {
                // Realiza una nueva solicitud HTTP POST al servidor para eliminar al alumno
                fetch('../Controladores_Alumno/Borrar_Alumno.php', {
                    method: 'POST', // Método HTTP POST
                    headers: { 'Content-Type': 'application/json' }, // Indica que el contenido es JSON
                    body: JSON.stringify({ numero_de_control: numeroControl }) // Envía el número de control en formato JSON
                })
                .then(response => response.json()) // Convierte la respuesta del servidor a JSON
                .then(data => {
                    if (data.status === "success") {
                        mensajeDiv.classList.add('mensaje-exito'); // Añade una clase para estilizar el mensaje de éxito
                        mensajeDiv.textContent = data.message; // Muestra el mensaje de éxito devuelto por el servidor
                        datosAlumnoDiv.style.display = 'none'; // Oculta los datos del alumno
                    } else {
                        mensajeDiv.classList.add('mensaje-error'); // Añade una clase para estilizar el mensaje de error
                        mensajeDiv.textContent = data.message; // Muestra el mensaje de error devuelto por el servidor
                    }
                    mensajeDiv.style.display = 'block'; // Muestra el mensaje en la interfaz
                });
            });
        } else {
            // Si no se encontró al alumno, muestra un mensaje de error
            datosAlumnoDiv.style.display = 'none'; // Oculta el contenedor de datos del alumno
            mensajeDiv.classList.add('mensaje-error'); // Añade una clase para estilizar el mensaje de error
            mensajeDiv.textContent = data.message; // Muestra el mensaje de error devuelto por el servidor
            mensajeDiv.style.display = 'block'; // Muestra el mensaje en la interfaz
        }
    });
});