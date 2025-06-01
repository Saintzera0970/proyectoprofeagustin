// Inicializar los iconos de Lucide
lucide.createIcons();

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const date = now.toLocaleDateString('es-ES', options);
    const time = now.toLocaleTimeString('es-ES', timeOptions);
    
    document.getElementById('datetime').textContent = `${date} - ${time}`;
    document.getElementById('userDate').textContent = date;
    document.getElementById('userTime').textContent = time;
}

// Update datetime every second
setInterval(updateDateTime, 1000);
updateDateTime();

// Añadir efecto hover a las cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
    });
}); 