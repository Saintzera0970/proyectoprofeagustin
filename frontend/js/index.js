// Inicializar los iconos de Lucide
lucide.createIcons();

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordToggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggleIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        passwordInput.type = 'password';
        passwordToggleIcon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

function validarCredenciales() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('loginButton');

    // Validar las credenciales
    if (username === 'prueba' && password === 'prueba123') {
        loginButton.classList.remove('opacity-50', 'cursor-not-allowed');
        loginButton.removeAttribute('disabled');
        loginButton.onclick = () => window.location.href = 'home.html';
    } else {
        loginButton.classList.add('opacity-50', 'cursor-not-allowed');
        loginButton.setAttribute('disabled', '');
        loginButton.onclick = null;
    }
} 