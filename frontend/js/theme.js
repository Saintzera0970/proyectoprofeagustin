// Función para manejar el tema
function initTheme() {
    // Verificar si hay un tema guardado
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema guardado o preferencia del sistema
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        updateThemeColors('dark');
    } else {
        updateThemeColors('light');
    }
}

// Función para cambiar el tema
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Actualizar colores según el tema
    updateThemeColors(isDark ? 'dark' : 'light');
    
    // Actualizar el ícono del botón en todas las páginas
    const themeIcons = document.querySelectorAll('.theme-icon');
    themeIcons.forEach(icon => {
        const sunIcon = icon.querySelector('.sun-icon');
        const moonIcon = icon.querySelector('.moon-icon');
        if (sunIcon && moonIcon) {
            sunIcon.classList.toggle('hidden');
            moonIcon.classList.toggle('hidden');
        }
    });
}

// Función para actualizar los colores según el tema
function updateThemeColors(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        // Colores de fondo más oscuros
        root.style.setProperty('--bg-main', '#0f172a'); // Fondo principal más oscuro
        root.style.setProperty('--bg-card', '#1e293b'); // Fondo de tarjetas más oscuro
        
        // Textos más claros para mejor contraste
        root.style.setProperty('--text-primary', '#ffffff'); // Texto principal blanco puro
        root.style.setProperty('--text-secondary', '#f1f5f9'); // Texto secundario casi blanco
        root.style.setProperty('--text-tertiary', '#e2e8f0'); // Texto terciario muy claro
        
        // Bordes y elementos de interfaz
        root.style.setProperty('--border-color', '#334155'); // Bordes más visibles
        root.style.setProperty('--input-bg', '#1e293b'); // Fondo de inputs
        root.style.setProperty('--input-text', '#ffffff'); // Texto de inputs blanco
        root.style.setProperty('--input-placeholder', '#94a3b8'); // Placeholder más visible
        root.style.setProperty('--hover-bg', '#334155'); // Hover más visible
        
        // Colores de estado y énfasis
        root.style.setProperty('--muted-text', '#cbd5e1'); // Texto muted más claro
        root.style.setProperty('--link-color', '#60a5fa'); // Enlaces más brillantes
        root.style.setProperty('--link-hover', '#93c5fd'); // Hover de enlaces más claro
        root.style.setProperty('--success-text', '#4ade80'); // Verde más brillante
        root.style.setProperty('--warning-text', '#fbbf24'); // Amarillo más brillante
        root.style.setProperty('--error-text', '#f87171'); // Rojo más brillante
        root.style.setProperty('--header-text', '#ffffff'); // Texto de encabezado blanco puro
        
        // Nuevos colores para elementos específicos
        root.style.setProperty('--card-hover', '#334155'); // Color hover para tarjetas
        root.style.setProperty('--button-hover', '#475569'); // Color hover para botones
        root.style.setProperty('--divider-color', '#334155'); // Color para divisores
        root.style.setProperty('--icon-color', '#ffffff'); // Color para iconos blanco
        root.style.setProperty('--tab-active-bg', '#334155'); // Fondo de tab activo
        root.style.setProperty('--input-focus-border', '#60a5fa'); // Borde de input en focus
        root.style.setProperty('--input-focus-shadow', 'rgba(96, 165, 250, 0.2)'); // Sombra de input en focus
    } else {
        // Modo claro (mantenemos los colores originales)
        root.style.setProperty('--bg-main', '#f8fafc');
        root.style.setProperty('--bg-card', '#ffffff');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#475569');
        root.style.setProperty('--text-tertiary', '#64748b');
        root.style.setProperty('--border-color', '#e2e8f0');
        root.style.setProperty('--input-bg', '#ffffff');
        root.style.setProperty('--input-text', '#1e293b');
        root.style.setProperty('--input-placeholder', '#94a3b8');
        root.style.setProperty('--hover-bg', '#f1f5f9');
        root.style.setProperty('--muted-text', '#64748b');
        root.style.setProperty('--link-color', '#2563eb');
        root.style.setProperty('--link-hover', '#1d4ed8');
        root.style.setProperty('--success-text', '#16a34a');
        root.style.setProperty('--warning-text', '#d97706');
        root.style.setProperty('--error-text', '#dc2626');
        root.style.setProperty('--header-text', '#1e293b');
        root.style.setProperty('--card-hover', '#f8fafc');
        root.style.setProperty('--button-hover', '#f1f5f9');
        root.style.setProperty('--divider-color', '#e2e8f0');
        root.style.setProperty('--icon-color', '#475569');
        root.style.setProperty('--tab-active-bg', '#f1f5f9');
        root.style.setProperty('--input-focus-border', '#2563eb');
        root.style.setProperty('--input-focus-shadow', 'rgba(37, 99, 235, 0.2)');
    }
}

// Inicializar tema al cargar
initTheme(); 