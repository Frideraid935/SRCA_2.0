document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item");
    const iframeContenido = document.getElementById("iframe-contenido");

    // Cambiar el contenido del iframe al seleccionar un menú
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            const formId = item.getAttribute("data-form");
            iframeContenido.src = `${formId}.html`;
        });
    });

    // Redirigir al menú principal
    document.getElementById("btn-inicio").addEventListener("click", function () {
        window.location.href = "../Menu_inicio/inicio_Admin.html";
    });
});