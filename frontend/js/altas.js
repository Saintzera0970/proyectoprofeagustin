// Inicializar los iconos de Lucide
lucide.createIcons();

// Función para actualizar la fecha y hora
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    
    const fecha = now.toLocaleDateString('es-ES', options);
    const hora = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    // Formatear la primera letra en mayúscula
    const fechaFormateada = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    
    document.getElementById('datetime').textContent = `${fechaFormateada} - ${hora}`;
}

// Actualizar fecha y hora cada segundo
setInterval(updateDateTime, 1000);
updateDateTime();

function showTab(tabId) {
    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
    });

    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar el contenido seleccionado
    const selectedContent = document.getElementById(tabId);
    selectedContent.classList.remove('hidden');
    selectedContent.classList.add('active');

    // Activar el botón seleccionado
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Mostrar/ocultar campos de cuenta corriente
document.querySelector('select').addEventListener('change', function(e) {
    const cuentaCorrienteFields = document.querySelector('.cuenta-corriente-fields');
    if (e.target.value === 'cuenta_corriente') {
        cuentaCorrienteFields.classList.remove('hidden');
    } else {
        cuentaCorrienteFields.classList.add('hidden');
    }
}); 