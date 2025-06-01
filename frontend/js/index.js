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