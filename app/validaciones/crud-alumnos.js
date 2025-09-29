document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.menu-item');
    const formContainers = document.querySelectorAll('.contenedor-formulario');

    // Cambiar entre formularios (Registro, Búsqueda, Actualización, Eliminación)
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            const formId = this.getAttribute('data-form');
            formContainers.forEach(container => container.classList.remove('active'));
            document.getElementById(`form-${formId}`).classList.add('active');
        });
    });

    // Manejo de envío de formularios mediante AJAX
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevenir el envío normal del formulario

            const formData = new FormData(this);
            const action = formData.get('action'); // Obtener la acción del formulario

            // Determinar el archivo PHP a usar según la acción
            let phpFile = '';
            switch (action) {
                case 'registrar':
                    phpFile = '../Controladores2/Ingresar_Alumno.php';
                    break;
                case 'buscar':
                    phpFile = '../Controladores2/Buscar_Alumno.php';
                    break;
                case 'actualizar':
                    phpFile = '../Controladores2/Actualizar_Alumno.php';
                    break;
                case 'eliminar':
                    phpFile = '../Controladores2/Borrar_Alumno.php';
                    break;
                default:
                    alert('Acción no válida.');
                    return;
            }

            // Usar AJAX para enviar el formulario sin recargar la página
            fetch(phpFile, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                const mensajeDiv = this.closest('.contenedor-formulario').querySelector('.mensaje');
                if (data.success) {
                    mensajeDiv.style.backgroundColor = '#dff0d8'; // Mensaje de éxito
                    mensajeDiv.textContent = data.message;

                    // Mostrar resultados según la acción
                    if (this.id === 'formulario-buscar') {
                        document.getElementById('resultados-busqueda').style.display = 'block';
                        llenarCamposBusqueda(data.data);
                    } else if (this.id === 'formulario-actualizar') {
                        document.getElementById('formulario-actualizacion').style.display = 'block';
                        llenarCamposActualizacion(data.data);
                    } else if (this.id === 'formulario-eliminar') {
                        document.getElementById('resultados-eliminar').style.display = 'block';
                        llenarCamposEliminacion(data.data);
                    }
                } else {
                    mensajeDiv.style.backgroundColor = '#f8d7da'; // Mensaje de error
                    mensajeDiv.textContent = data.error || 'Ocurrió un error.';
                }
                mensajeDiv.style.display = 'block'; // Mostrar el mensaje
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });

    // Función para llenar los campos de búsqueda
    function llenarCamposBusqueda(alumno) {
        document.getElementById('nombre-buscar').value = alumno.nombre;
        document.getElementById('curso-buscar').value = alumno.curso;
        document.getElementById('email-buscar').value = alumno.email;
        document.getElementById('telefono-buscar').value = alumno.telefonos;
    }

    // Función para llenar los campos de actualización
    function llenarCamposActualizacion(alumno) {
        document.getElementById('nombre-actualizar').value = alumno.nombre;
        document.getElementById('curso-actualizar').value = alumno.curso;
        document.getElementById('email-actualizar').value = alumno.email;
        document.getElementById('actualizar-id').value = alumno.id;
    }

    // Función para llenar los campos de eliminación
    function llenarCamposEliminacion(alumno) {
        document.getElementById('nombre-eliminar').value = alumno.nombre;
        document.getElementById('curso-eliminar').value = alumno.curso;
        document.getElementById('email-eliminar').value = alumno.email;
    }

    // Confirmar eliminación
    document.getElementById('btn-confirmar-eliminacion').addEventListener('click', function () {
        const numeroDeControl = document.getElementById('eliminar-numero').value;

        fetch('../Controladores/eliminar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'eliminar', numero_de_control: numeroDeControl })
        })
        .then(response => response.json())
        .then(data => {
            const mensajeDiv = document.getElementById('mensaje-eliminar');
            if (data.success) {
                mensajeDiv.style.backgroundColor = '#dff0d8'; // Mensaje de éxito
                mensajeDiv.textContent = data.message;
            } else {
                mensajeDiv.style.backgroundColor = '#f8d7da'; // Mensaje de error
                mensajeDiv.textContent = data.error || 'Ocurrió un error.';
            }
            mensajeDiv.style.display = 'block'; // Mostrar el mensaje
            document.getElementById('resultados-eliminar').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});