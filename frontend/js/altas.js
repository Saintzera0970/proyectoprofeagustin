// Inicializar los iconos de Lucide
lucide.createIcons();

function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    document.getElementById('datetime').textContent = `${date} - ${time}`;
}

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

// Actualizar fecha y hora cada segundo
setInterval(updateDateTime, 1000);
updateDateTime(); 