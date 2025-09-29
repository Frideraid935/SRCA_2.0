document.getElementById("login").addEventListener("submit", function(event) {
    // Obtener los valores del formulario
    var usuario = document.getElementById("usuario").value;
    var contraseña = document.getElementById("contraseña").value;

    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usuario || !contraseña) {
        alert("Todos los campos son obligatorios.");
        event.preventDefault(); // Prevenir el envío del formulario
        return;
    }
    
    if (!contraseñaPattern.test(contraseña)) {
        alert("la contraseña debe tener exactamente 8 dígitos");
        event.preventDefault(); // Prevenir el envío del formulario
        return;
    }

    alert("Formulario enviado correctamente.");
});