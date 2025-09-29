// Agrega un evento al formulario de registro para interceptar su envío
document.getElementById('formulario-registro').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional (recarga de página)

    // Crea un objeto FormData a partir del formulario para capturar todos los campos
    var formData = new FormData(this);

    // Realiza una solicitud HTTP POST al servidor utilizando Fetch API
    fetch('../Controladores_Alumno/Ingresar_Alumno.php', {
        method: 'POST', // Método HTTP POST
        body: formData // Envía los datos del formulario en formato FormData
    })
    .then(response => response.json()) // Convierte la respuesta del servidor a JSON
    .then(data => {
        // Obtiene el elemento HTML donde se mostrará el mensaje de éxito o error
        const mensajeDiv = document.getElementById('mensaje-registro');

        if (data.status === "success") {
            // Si el registro es exitoso, cambia el color de fondo del mensaje a verde (#dff0d8)
            mensajeDiv.style.backgroundColor = '#dff0d8'; // Color de éxito
        } else {
            // Si ocurre un error, cambia el color de fondo del mensaje a rojo (#f8d7da)
            mensajeDiv.style.backgroundColor = '#f8d7da'; // Color de error
        }

        // Muestra el mensaje devuelto por el servidor
        mensajeDiv.textContent = data.message;
        mensajeDiv.style.display = 'block'; // Hace visible el mensaje en la interfaz
    })
    .catch(error => {
        // Captura cualquier error ocurrido durante la solicitud HTTP
        console.error('Error:', error); // Imprime el error en la consola del navegador
    });
});