document.addEventListener('DOMContentLoaded', function() {
    // Controlador para cambiar entre módulos
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            if(this.id === 'btn-inicio') {
                window.location.href = '../menu-principal.html';
                return;
            }

            // Actualizar menú activo
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            
            // Cargar el módulo correspondiente
            const modulo = this.getAttribute('data-modulo');
            document.getElementById('contenido-iframe').src = `modulos/${modulo}/${modulo}.html`;
        });
    });

    // Comunicación entre iframes y ventana principal
    window.addEventListener('message', function(e) {
        if(e.data.action === 'mostrarMensaje') {
            alert(e.data.mensaje);
        }
    });
});