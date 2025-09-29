document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío normal del formulario

    // Validar el formulario
    if (validarFormulario()) {
        var formData = new FormData(this);

        // Usar AJAX para enviar el formulario sin recargar la página
        fetch('crud.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const mensajeDiv = document.getElementById('mensaje');
            if (data.status === "success") {
                mensajeDiv.style.backgroundColor = '#dff0d8'; // Mensaje de éxito
            } else {
                mensajeDiv.style.backgroundColor = '#f8d7da'; // Mensaje de error
            }
            mensajeDiv.textContent = data.message;
            mensajeDiv.style.display = 'block'; // Mostrar el mensaje
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

function validarFormulario() {
    let esValido = true;

    // Limpia mensajes de error previos
    const errores = document.querySelectorAll('.campo small');
    errores.forEach((error) => error.remove());

    // Campos a validar
    const campos = [
        { id: 'nombre', regex: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/, mensaje: 'Nombre inválido. Solo letras y espacios.' },
        { id: 'curso', regex: /^[a-zA-Z0-9\s]+$/, mensaje: 'Curso inválido. Solo letras, números y espacios.' },
        { id: 'direccion', regex: /^[\w\s,.#-]+$/, mensaje: 'Dirección inválida.' },
        { id: 'poblacion', regex: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/, mensaje: 'Población inválida. Solo letras y espacios.' },
        { id: 'cp', regex: /^\d{5}$/, mensaje: 'Código postal inválido. Debe ser de 5 dígitos.' },
        { id: 'telefonos', regex: /^(\+?\d{1,3})?[-.\s]?(\d{10})$/, mensaje: 'Teléfono inválido.' },
        { id: 'email', regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, mensaje: 'Correo electrónico inválido.' },
        { id: 'telefono_contacto', regex: /^(\+?\d{1,3})?[-.\s]?(\d{10})$/, mensaje: 'Teléfono de contacto inválido.' },
        { id: 'curp', regex: /^[A-Z\d]{18}$/, mensaje: 'CURP inválido. Debe tener 18 caracteres.' },
        // Agrega validaciones adicionales según corresponda
    ];

    // Validar cada campo
    for (const campo of campos) {
        const input = document.getElementById(campo.id);
        const valor = input.value.trim();

        if (!campo.regex.test(valor)) {
            mostrarError(input, campo.mensaje);
            esValido = false;
        }
    }

    return esValido;
}

function mostrarError(input, mensaje) {
    const error = document.createElement('small');
    error.style.color = 'red';
    error.textContent = mensaje;
    input.parentElement.appendChild(error);
    input.focus();
}
