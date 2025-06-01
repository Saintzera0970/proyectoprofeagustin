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

// Función para cambiar entre pestañas
function showTab(tabId) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    const selectedTab = document.getElementById(tabId);
    const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
    
    if (selectedTab && selectedButton) {
        selectedTab.classList.remove('hidden');
        setTimeout(() => {
            selectedTab.classList.add('active');
        }, 50);
        selectedButton.classList.add('active');
    }
}

// Función para mostrar/ocultar campos de cuenta corriente
function toggleCuentaCorriente(value) {
    const cuentaCorrienteFields = document.getElementById('cuenta-corriente-fields');
    const limiteCreditoInput = cuentaCorrienteFields.querySelector('input[type="number"]');
    
    if (value === 'cuenta_corriente') {
        cuentaCorrienteFields.classList.remove('hidden');
        limiteCreditoInput.required = true;
    } else {
        cuentaCorrienteFields.classList.add('hidden');
        limiteCreditoInput.required = false;
    }
}

// Función para mostrar/ocultar contraseña
function togglePassword(button) {
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

// Validar formularios antes de enviar
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validar campos requeridos
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                
                // Mostrar mensaje de error
                const errorMessage = field.parentElement.querySelector('.error-message');
                if (!errorMessage) {
                    const message = document.createElement('span');
                    message.className = 'text-xs text-red-500 error-message';
                    message.textContent = 'Este campo es obligatorio';
                    field.parentElement.appendChild(message);
                }
            }
        });
        
        if (isValid) {
            // Aquí iría la lógica para enviar el formulario
            console.log('Formulario válido, enviando datos...');
            form.reset();
            
            // Mostrar mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed bottom-4 right-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2';
            successMessage.innerHTML = `
                <i data-lucide="check-circle" class="w-5 h-5"></i>
                <span>Datos guardados correctamente</span>
            `;
            document.body.appendChild(successMessage);
            lucide.createIcons();
            
            // Eliminar mensaje después de 3 segundos
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });
    
    // Limpiar errores cuando el usuario comienza a escribir
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('border-red-500');
            const errorMessage = field.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
}); 