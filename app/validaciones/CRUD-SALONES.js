// Utilidades para manejar LocalStorage
function obtenerSalones() {
    return JSON.parse(localStorage.getItem("salones")) || [];
}

function guardarSalones(salones) {
    localStorage.setItem("salones", JSON.stringify(salones));
}
/*
function guardar() {
    const id = document.getElementById("id_salon").value.trim();
    const nombreSalon = document.getElementById("nombre_salon").value.trim();
    const capacidad = document.getElementById("capacidad").value.trim();
    const profesor = document.getElementById("nombre_profesor").value.trim();
    const mensaje = document.getElementById("mensaje-registro");

    if (id === "" || nombreSalon === "" || capacidad === "" || profesor === "") {
        mensaje.textContent = "Por favor, complete todos los campos.";
        mensaje.style.color = "red";
    } else {
        // Aquí se guardan los datos en una base de datos
        mensaje.textContent = "Datos guardados correctamente.";
        mensaje.style.color = "green";

        //  limpiar el formulario automáticamente después de guardar:
        document.getElementById("formulario-salon").reset();
    }
}
    */
// REGISTRAR
function guardar() {
    const id = document.getElementById("id_salon").value.trim();
    const nombre = document.getElementById("nombre_salon").value.trim();
    const capacidad = document.getElementById("capacidad").value.trim();
    const profesor = document.getElementById("nombre_profesor").value.trim();
    const mensaje = document.getElementById("mensaje-registro");

    if (!id || !nombre || !capacidad || !profesor) {
        mensaje.textContent = "Por favor, complete todos los campos.";
        mensaje.style.color = "red";
        mensaje.style.display = "block";
        return;
    }

    const salones = obtenerSalones();
    const existe = salones.some(salon => salon.id === id);

    if (existe) {
        mensaje.textContent = "Ya existe un salón con ese ID.";
        mensaje.style.color = "red";
    } else {
        salones.push({ id, nombre, capacidad, profesor });
        guardarSalones(salones);
        mensaje.textContent = "Salón registrado correctamente.";
        mensaje.style.color = "green";
        document.getElementById("formulario-salon").reset();
    }

    mensaje.style.display = "block";
    setTimeout(() => mensaje.style.display = "none", 3000);
}

// BUSCAR
document.getElementById("btn-buscar").addEventListener("click", () => {
    const id = document.getElementById("busqueda-id").value.trim();
    const mensaje = document.getElementById("mensaje-busqueda");
    const datos = document.getElementById("datos-salon");
    const contenedor = document.getElementById("resultados-busqueda");

    mensaje.style.display = "none";
    datos.innerHTML = "";
    contenedor.style.display = "none";

    if (!id) {
        mensaje.textContent = "Ingrese un ID para buscar.";
        mensaje.style.color = "red";
        mensaje.style.display = "block";
        return;
    }

    const salones = obtenerSalones();
    const salon = salones.find(s => s.id === id);

    if (salon) {
        datos.innerHTML = `
            <p><strong>Nombre:</strong> ${salon.nombre}</p>
            <p><strong>Capacidad:</strong> ${salon.capacidad}</p>
            <p><strong>Profesor:</strong> ${salon.profesor}</p>
        `;
        contenedor.style.display = "block";
    } else {
        mensaje.textContent = "No se encontró el salón.";
        mensaje.style.color = "red";
        mensaje.style.display = "block";
    }
});

// ACTUALIZAR
document.getElementById("btn-buscar-actualizar").addEventListener("click", () => {
    const id = document.getElementById("actualizar-id").value.trim();
    const form = document.getElementById("formulario-actualizar");
    const mensaje = document.getElementById("mensaje-actualizar");

    form.style.display = "none";
    form.innerHTML = "";
    mensaje.style.display = "none";

    if (!id) {
        mensaje.textContent = "Ingrese un ID para buscar.";
        mensaje.style.color = "red";
        mensaje.style.display = "block";
        return;
    }

    const salones = obtenerSalones();
    const salon = salones.find(s => s.id === id);

    if (salon) {
        form.innerHTML = `
            <div class="grupo-campos">
                <div class="campo">
                    <label>Nombre:</label>
                    <input type="text" id="act-nombre" value="${salon.nombre}">
                </div>
                <div class="campo">
                    <label>Capacidad:</label>
                    <input type="number" id="act-capacidad" value="${salon.capacidad}">
                </div>
                <div class="campo">
                    <label>Profesor:</label>
                    <input type="text" id="act-profesor" value="${salon.profesor}">
                </div>
            </div>
            <div class="botones">
                <button type="button" class="btn btn-success" onclick="actualizarSalon('${salon.id}')">Actualizar</button>
            </div>
        `;
        form.style.display = "block";
    } else {
        mensaje.textContent = "Salón no encontrado.";
        mensaje.style.color = "red";
        mensaje.style.display = "block";
    }
});

function actualizarSalon(id) {
    const nombre = document.getElementById("act-nombre").value.trim();
    const capacidad = document.getElementById("act-capacidad").value.trim();
    const profesor = document.getElementById("act-profesor").value.trim();
    const mensaje = document.getElementById("mensaje-actualizar");

    if (!nombre || !capacidad || !profesor) {
        mensaje.textContent = "Todos los campos son obligatorios.";
        mensaje.style.color = "red";
        mensaje.style.display = "block";
        return;
    }

    let salones = obtenerSalones();
    const index = salones.findIndex(s => s.id === id);
    if (index !== -1) {
        salones[index] = { id, nombre, capacidad, profesor };
        guardarSalones(salones);
        mensaje.textContent = "Salón actualizado correctamente.";
        mensaje.style.color = "green";
    } else {
        mensaje.textContent = "Error al actualizar.";
        mensaje.style.color = "red";
    }

    mensaje.style.display = "block";
    setTimeout(() => mensaje.style.display = "none", 3000);
}

// ELIMINAR
document.getElementById("btn-confirmar-eliminar").addEventListener("click", () => {
    const id = document.getElementById("eliminar-id").value.trim();
    const mensaje = document.getElementById("mensaje-eliminar");

    mensaje.style.display = "none";

    if (!id) {
        mensaje.textContent = "Ingrese un ID para eliminar.";
        mensaje.style.color = "red";
        mensaje.style.display = "block";
        return;
    }

    let salones = obtenerSalones();
    const index = salones.findIndex(s => s.id === id);

    if (index !== -1) {
        salones.splice(index, 1);
        guardarSalones(salones);
        mensaje.textContent = "Salón eliminado correctamente.";
        mensaje.style.color = "green";
    } else {
        mensaje.textContent = "Salón no encontrado.";
        mensaje.style.color = "red";
    }

    mensaje.style.display = "block";
    setTimeout(() => mensaje.style.display = "none", 3000);
});

document.getElementById("btn-inicio").addEventListener("click", function() {
    window.location.href = "../Menu_inicio/inicio_Admin.html";
});

// CAMBIO DE FORMULARIOS DESDE EL MENÚ
document.querySelectorAll('.menu-item[data-form]').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.contenedor-formulario').forEach(form => {
            form.classList.remove('active');
        });

        document.querySelectorAll('.menu-item').forEach(mi => {
            mi.classList.remove('active');
        });

        const formId = item.dataset.form;
        document.getElementById(`form-${formId}`).classList.add('active');
        item.classList.add('active');
    });

    

});
