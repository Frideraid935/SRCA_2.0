// Espera a que el DOM se cargue completamente antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene el formulario y el elemento donde se mostrarán los mensajes
    const form = document.getElementById("formulario-salon");
    const mensaje = document.getElementById("mensaje");

    // Asigna un evento 'submit' al formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita el envío tradicional del formulario

        // Obtiene y limpia los valores ingresados por el usuario
        const id = document.getElementById("id_salon").value.trim();
        const nombre = document.getElementById("nombre_salon").value.trim();
        const capacidad = document.getElementById("capacidad").value.trim();
        const profesorId = document.getElementById("profesor_id").value.trim();

        // Reinicia el estado del mensaje
        mensaje.textContent = "";
        mensaje.className = "mensaje";
        mensaje.style.display = "none";

        // Validación: Todos los campos son obligatorios
        if (!id || !nombre || !capacidad || !profesorId) {
            mostrarMensaje("⚠️ Todos los campos son obligatorios.", false);
            return;
        }

        // Validación: El ID debe ser un número positivo
        if (isNaN(id) || id <= 0) {
            mostrarMensaje("⚠️ El ID del salón debe ser un número positivo.", false);
            return;
        }

        // Validación: La capacidad debe ser un número positivo
        if (isNaN(capacidad) || capacidad <= 0) {
            mostrarMensaje("⚠️ La capacidad debe ser un número positivo.", false);
            return;
        }

        // Preparar datos del formulario en formato JSON
        const datos = {
            id: id,
            nombre: nombre,
            capacidad: capacidad,
            profesor_id: profesorId
        };

        // Enviar datos al servidor usando fetch API
        fetch("../Controlador_Salon/salones.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Tipo de contenido enviado
            },
            body: JSON.stringify(datos) // Convertir objeto a cadena JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json(); // Parsear respuesta JSON
        })
        .then(data => {
            if (data.status === "success") {
                // Mostrar mensaje de éxito y reiniciar el formulario
                mostrarMensaje("✅ Salón registrado correctamente.", true);
                form.reset();
            } else {
                // Mostrar mensaje de error devuelto por el servidor
                mostrarMensaje(`❌ ${data.message || "Error al registrar salón"}`, false);
            }
        })
        .catch(error => {
            // Capturar y mostrar cualquier error durante la solicitud
            console.error("Error:", error);
            mostrarMensaje("❌ Error al conectar con el servidor.", false);
        });
    });

    /**
     * Muestra un mensaje en pantalla con estilo de éxito o error.
     * @param {string} texto - El mensaje a mostrar.
     * @param {boolean} esExito - Si es true, muestra como éxito; si false, como error.
     */
    function mostrarMensaje(texto, esExito) {
        mensaje.textContent = texto;
        mensaje.className = esExito ? "mensaje mensaje-exito" : "mensaje mensaje-error";
        mensaje.style.display = "block"; // Hacer visible el mensaje
    }
});