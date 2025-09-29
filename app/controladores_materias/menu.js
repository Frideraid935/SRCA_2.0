function cargarFormulario(url) {
  const iframe = document.getElementById('contenido-iframe');
  iframe.src = url;
  
  // Actualizar menú activo
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  // Ajustar altura del iframe
  iframe.onload = function() {
    setTimeout(() => {
      const contentHeight = iframe.contentWindow.document.body.scrollHeight;
      iframe.style.height = contentHeight + 'px';
    }, 100);
  };
}

// Ajustar altura inicial
window.addEventListener('load', function() {
  const iframe = document.getElementById('contenido-iframe');
  iframe.onload();
});