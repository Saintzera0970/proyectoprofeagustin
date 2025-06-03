// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los iconos de Lucide
    lucide.createIcons();
    
    // Referencias a elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // Función para mostrar mensajes de error
    function showError(message) {
        errorMessage.innerHTML = `
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
            <span>${message}</span>
        `;
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
        lucide.createIcons();

        // Animar los campos con error
        [usernameInput, passwordInput].forEach(input => {
            input.classList.add('border-red-500');
            input.addEventListener('input', function() {
                input.classList.remove('border-red-500');
                errorMessage.classList.add('hidden');
            }, { once: true });
        });
    }

    // Función para mostrar mensajes de éxito
    function showSuccess(message) {
        successMessage.innerHTML = `
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <span>${message}</span>
        `;
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        lucide.createIcons();
    }

    // Función para mostrar el estado de carga
    function setLoading(isLoading) {
        if (isLoading) {
            loginButton.classList.add('loading');
            loginButton.disabled = true;
            loginButton.innerHTML = '<span class="opacity-0">Ingresar al Sistema</span>';
        } else {
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
            loginButton.innerHTML = `
                <i data-lucide="log-in" class="w-5 h-5"></i>
                <span>Ingresar al Sistema</span>
            `;
            lucide.createIcons();
        }
    }

    // Función para validar las credenciales
    async function validarCredenciales(username, password) {
        try {
            const response = await fetch('https://back-prof-agustin-2.onrender.com/empleados');
            const empleados = await response.json();
            
            // Buscar el empleado que coincida con el usuario y contraseña
            const empleadoEncontrado = empleados.find(
                emp => emp.nombre === username && emp.pw === password
            );

            if (empleadoEncontrado) {
                // Guardar información del empleado en localStorage
                localStorage.setItem('empleadoData', JSON.stringify({
                    id: empleadoEncontrado.id,
                    nombre: empleadoEncontrado.nombre,
                    rol: empleadoEncontrado.rol
                }));
                
                return { 
                    success: true,
                    empleado: empleadoEncontrado
                };
            } else {
                return { 
                    success: false, 
                    error: 'Usuario o contraseña incorrectos'
                };
            }
        } catch (error) {
            console.error('Error al validar credenciales:', error);
            return {
                success: false,
                error: 'Error al conectar con el servidor'
            };
        }
    }

    // Manejar el envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Validaciones básicas
        if (!username || !password) {
            showError('Por favor completa todos los campos');
            return;
        }

        // Intentar login
        try {
            setLoading(true);
            const result = await validarCredenciales(username, password);

            if (result.success) {
                showSuccess('¡Inicio de sesión exitoso!');
                
                // Guardar el estado de la sesión
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirigir después de un breve delay
                setTimeout(() => {
                    window.location.href = '/html/home.html';
                }, 1000);
            } else {
                showError(result.error);
            }
        } catch (error) {
            showError('Error al intentar iniciar sesión. Por favor intenta nuevamente.');
            console.error('Error de login:', error);
        } finally {
            setLoading(false);
        }
    });

    // Función para mostrar/ocultar contraseña
    window.togglePassword = function(button) {
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

    // Verificar si ya hay una sesión activa
    // if (localStorage.getItem('isLoggedIn') === 'true') {
    //     window.location.href = 'frontend/html/home.html';
    // }

    // Focus inicial en el campo de usuario
    usernameInput.focus();
}); 