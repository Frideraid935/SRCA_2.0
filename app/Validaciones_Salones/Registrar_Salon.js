document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario-salon");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = document.getElementById("id_salon").value.trim();
        const nombre = document.getElementById("nombre_salon").value.trim();
        const capacidad = document.getElementById("capacidad").value.trim();
        const profesorId = document.getElementById("profesor_id").value.trim();

        mensaje.textContent = "";
        mensaje.className = "mensaje";
        mensaje.style.display = "none";

        // Validaciones básicas
        if (!id || !nombre || !capacidad || !profesorId) {
            mostrarMensaje("⚠️ Todos los campos son obligatorios.", false);
            return;
        }
        if (isNaN(id) || id <= 0) {
            mostrarMensaje("⚠️ El ID del salón debe ser un número positivo.", false);
            return;
        }
        if (isNaN(capacidad) || capacidad <= 0) {
            mostrarMensaje("⚠️ La capacidad debe ser un número positivo.", false);
            return;
        }

        // Preparar datos en JSON
        const datos = { id, nombre, capacidad, profesor_id: profesorId };

        // Consumir API REST
        fetch("http://localhost:8080/api_salones.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                mostrarMensaje("✅ Salón registrado correctamente.", true);
                form.reset();
            } else {
                mostrarMensaje(`❌ ${data.message}`, false);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarMensaje("❌ Error al conectar con el servidor.", false);
        });
    });

    function mostrarMensaje(texto, esExito) {
        mensaje.textContent = texto;
        mensaje.className = esExito ? "mensaje mensaje-exito" : "mensaje mensaje-error";
        mensaje.style.display = "block";
    }
});
