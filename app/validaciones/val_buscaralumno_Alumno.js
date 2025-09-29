document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const formularios = document.querySelectorAll('.contenedor-formulario');
    const btnBuscar = document.getElementById('btn-buscar');
    const btnBuscarActualizar = document.getElementById('btn-buscar-actualizar');

    // Función para mostrar el formulario correspondiente
    const mostrarFormulario = (formId) => {
        formularios.forEach(form => form.classList.remove('active'));
        document.getElementById(`form-${formId}`).classList.add('active');
    };

    // Mostrar el formulario de buscar alumno al inicio
    mostrarFormulario('buscar'); // Asegúrate que este ID coincida con tu formulario

    // Manejo del clic en los elementos del menú
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const formId = item.getAttribute('data-form');
            if (formId === 'inicio') {
                window.location.href = "index.html";
            } else {
                mostrarFormulario(formId);
            }
        });
    });

    document.getElementById("btn-inicio").addEventListener("click", function() {
        window.location.href = "../Menu_inicio/inicio_Alumno.html";
    });

    // Resto de tu código...
    btnBuscar.addEventListener('click', () => {
        // ... (tu código existente para buscar alumno)
    });

    btnBuscarActualizar.addEventListener('click', () => {
        // ... (tu código existente para actualizar alumno)
    });
});