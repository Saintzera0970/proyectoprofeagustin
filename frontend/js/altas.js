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

// Variables globales para la paginación
let paginaActual = 1;
const ventasPorPagina = 10;
let ventasTotales = [];

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

// Función para mostrar/ocultar campos de contraseña según el rol
function togglePasswordField(rol) {
    const passwordFields = document.getElementById('password-fields');
    if (!passwordFields) return; // Evitar error si el elemento no existe
    
    const passwordInputs = passwordFields.querySelectorAll('input[type="password"]');
    
    // Solo mostrar contraseña para Cajero/a
    if (rol === 'Cajero/a') {
        passwordFields.classList.remove('hidden');
        passwordInputs.forEach(input => input.required = true);
    } else {
        passwordFields.classList.add('hidden');
        passwordInputs.forEach(input => {
            input.required = false;
            input.value = ''; // Limpiar valores
        });
    }
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(button) {
    if (!button) return; // Evitar error si el botón es null
    
    const input = button.parentElement?.querySelector('input');
    const icon = button.querySelector('i');
    
    if (!input || !icon) return; // Evitar error si no se encuentran los elementos
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    const esExito = tipo === 'success';
    
    notificacion.className = `fixed top-4 right-4 ${esExito ? 'bg-green-100' : 'bg-red-100'} rounded-lg shadow-lg p-4 z-50 transition-all duration-300 transform translate-x-full`;
    notificacion.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-10 h-10 ${esExito ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center">
                <i data-lucide="${esExito ? 'check' : 'x'}" class="w-6 h-6 text-white"></i>
            </div>
            <div class="min-w-[200px]">
                <h4 class="text-sm font-medium text-gray-900">${titulo}</h4>
                <p class="text-sm text-gray-700">${mensaje}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-gray-500 hover:text-gray-700">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notificacion);
    lucide.createIcons();

    // Animación de entrada
    requestAnimationFrame(() => {
        notificacion.style.transform = 'translateX(0)';
    });

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion && notificacion.parentElement) {
                notificacion.remove();
            }
        }, 300);
    }, 3000);
}

// Validar formularios antes de enviar
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Verificar si es el formulario de empleados
            if (form.closest('#empleados')) {
                const nombreInput = form.querySelector('input[placeholder="Nombre y Apellido"]');
                const telefonoInput = form.querySelector('input[placeholder="Número de teléfono"]');
                const rolSelect = form.querySelector('select[onchange="togglePasswordField(this.value)"]');
                const statusSelect = form.querySelector('select[required]');

                // Verificar que todos los elementos existen
                if (!nombreInput || !telefonoInput || !rolSelect || !statusSelect) {
                    throw new Error('Error en el formulario: faltan elementos requeridos');
                }

                const nombre = nombreInput.value.trim();
                const telefono = telefonoInput.value.trim();
                const rol = rolSelect.value;
                const status = statusSelect.value;
                
                // Validar campos requeridos
                if (!nombre || !telefono || !rol || !status) {
                    throw new Error('Por favor complete todos los campos requeridos');
                }

                // Validar contraseña solo para Cajero/a
                let password = null;
                
                if (rol === 'Cajero/a') {
                    const passwordFields = document.getElementById('password-fields');
                    if (!passwordFields) {
                        throw new Error('Error en el formulario: campos de contraseña no encontrados');
                    }

                    const pass1 = passwordFields.querySelector('.input-group:first-child input[type="password"]')?.value;
                    const pass2 = passwordFields.querySelector('.input-group:last-child input[type="password"]')?.value;
                    
                    if (!pass1 || pass1.length < 8) {
                        throw new Error('La contraseña debe tener al menos 8 caracteres');
                    }
                    
                    if (pass1 !== pass2) {
                        throw new Error('Las contraseñas no coinciden');
                    }
                    
                    password = pass1;
                }

                // Crear objeto con los datos del empleado
                const empleadoData = {
                    nombre,
                    telefono,
                    rol,
                    status,
                    password
                };

                // Enviar datos al servidor
                const response = await fetch('https://back-prof-agustin-2.onrender.com/empleados/postEmpleado', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(empleadoData)
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Error al guardar el empleado');
                }

                // Limpiar formulario
                form.reset();
                const passwordFields = document.getElementById('password-fields');
                if (passwordFields) {
                    passwordFields.classList.add('hidden');
                }
                
                // Mostrar mensaje de éxito
                mostrarNotificacion('Éxito', 'Empleado guardado correctamente', 'success');
            }
            // Verificar si es el formulario de clientes
            if (form.closest('#clientes')) {
                const nombreInput = form.querySelector('input[type="text"][required]');
                const dniInput = form.querySelector('input[placeholder="DNI/CUIT"]');
                const telefonoInput = form.querySelector('input[type="tel"]');
                const direccionInput = form.querySelector('input[placeholder="Dirección"]');

                // Verificar que los elementos obligatorios existen
                if (!nombreInput || !dniInput) {
                    throw new Error('Error en el formulario: faltan elementos requeridos');
                }

                const nombre = nombreInput.value.trim();
                const dni = dniInput.value.trim();
                const telefono = telefonoInput ? telefonoInput.value.trim() : '';
                const direccion = direccionInput ? direccionInput.value.trim() : '';
                
                // Validar campos requeridos
                if (!nombre || !dni) {
                    throw new Error('Por favor complete los campos obligatorios (Nombre y DNI)');
                }

                // Validar formato de DNI (solo números)
                if (!/^\d+$/.test(dni)) {
                    throw new Error('El DNI debe contener solo números, sin puntos ni espacios');
                }

                // Crear objeto con los datos del cliente
                const clienteData = {
                    nombre,
                    dni,
                    telefono,
                    direccion
                };

                // Enviar datos al servidor
                const response = await fetch('https://back-prof-agustin-2.onrender.com/clientes/postClient', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(clienteData)
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Error al guardar el cliente');
                }

                // Limpiar formulario
                form.reset();
                
                // Mostrar mensaje de éxito
                mostrarNotificacion('Éxito', 'Cliente guardado correctamente', 'success');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error', error.message, 'error');
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

// Función para cerrar sesión
function cerrarSesion() {
    // Eliminar datos del empleado del localStorage
    localStorage.removeItem('empleadoData');
    
    // Redirigir al index
    window.location.href = '/frontend/html/index.html';
} 