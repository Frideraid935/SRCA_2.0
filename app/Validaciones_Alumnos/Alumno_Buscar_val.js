// Agrega un evento al formulario de búsqueda para interceptar su envío
document.getElementById('formulario-buscar').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional (recarga de página)

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
        // Obtiene los elementos HTML necesarios para mostrar los resultados y mensajes
        const resultadosDiv = document.getElementById('resultados-busqueda'); // Contenedor para los datos del alumno
        const mensajeDiv = document.getElementById('mensaje-busqueda'); // Contenedor para mensajes de error

        if (data.status === "success") {
            // Si la búsqueda es exitosa, muestra los datos del alumno
            resultadosDiv.style.display = 'block'; // Muestra el contenedor de resultados
            mensajeDiv.style.display = 'none'; // Oculta cualquier mensaje de error previo

            const alumno = data.data; // Datos del alumno obtenidos del servidor

            // Genera dinámicamente los datos del alumno en el contenedor "datos-alumno"
            document.getElementById('datos-alumno').innerHTML = `
                <p><strong>Nombre:</strong> ${alumno.nombre}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${alumno.fecha_nacimiento}</p>
                <p><strong>Curso:</strong> ${alumno.curso}</p>
                <p><strong>Población:</strong> ${alumno.poblacion}</p>
                <p><strong>Dirección:</strong> ${alumno.direccion}</p>
                <p><strong>Email:</strong> ${alumno.email}</p>
                <p><strong>Teléfonos:</strong> ${alumno.telefonos}</p>
                <p><strong>CURP:</strong> ${alumno.curp}</p>
                <p><strong>Alergias:</strong> ${alumno.alergico || 'N/A'}</p>
                <p><strong>Contacto en caso de accidente:</strong> ${alumno.contacto_accidente || 'N/A'}</p>
            `;
        } else {
            // Si no se encuentra al alumno, muestra un mensaje de error
            resultadosDiv.style.display = 'none'; // Oculta el contenedor de resultados
            mensajeDiv.classList.add('mensaje-error'); // Añade una clase para estilizar el mensaje de error
            mensajeDiv.textContent = data.message; // Muestra el mensaje de error devuelto por el servidor
            mensajeDiv.style.display = 'block'; // Muestra el mensaje en la interfaz
        }
    });
});