// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
    // Obtener todos los elementos del menú con la clase 'menu-item'
    const menuItems = document.querySelectorAll(".menu-item");

    // Obtener el iframe donde se cargarán los formularios
    const iframeContenido = document.getElementById("iframe-contenido");

    // Recorrer cada elemento del menú para asignar un evento 'click'
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            // Caso especial: Si se hace clic en "Inicio", redirigir a otra página
            if (item.id === "btn-inicio") {
                window.location.href = "../Menu_inicio/inicio_Admin.html";
                return;
            }

            // Remover la clase 'active' de todos los elementos del menú
            menuItems.forEach(i => i.classList.remove("active"));

            // Agregar la clase 'active' al elemento seleccionado (para resaltarlo visualmente)
            item.classList.add("active");

            // Obtener el valor del atributo 'data-form', que indica qué formulario cargar
            const formId = item.getAttribute("data-form");

            // Si el atributo existe, cargar el archivo HTML correspondiente en el iframe
            if (formId) {
                iframeContenido.src = `${formId}.html`;
            }
        });
    });
});