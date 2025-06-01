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
    document.getElementById('saleDate').textContent = date;
}

function selectPaymentMethod(method) {
    // Ocultar todos los campos
    document.querySelectorAll('.payment-fields').forEach(fields => {
        fields.classList.add('hidden');
    });
    
    // Remover la clase selected de todos los métodos
    document.querySelectorAll('.payment-method').forEach(methodDiv => {
        methodDiv.classList.remove('selected');
    });
    
    // Mostrar los campos del método seleccionado
    const selectedFields = document.getElementById(`${method}_fields`);
    const selectedMethod = document.querySelector(`[value="${method}"]`).closest('.payment-method');
    
    if (selectedFields) {
        selectedFields.classList.remove('hidden');
    }
    if (selectedMethod) {
        selectedMethod.classList.add('selected');
    }
    
    // Marcar el radio button
    document.querySelector(`[value="${method}"]`).checked = true;
}

function calcularVuelto(montoRecibido) {
    const total = 120.99; // Este valor debería venir del total real de la venta
    const vuelto = montoRecibido - total;
    document.getElementById('vuelto').textContent = `$${vuelto.toFixed(2)}`;
}

function searchProducts(query) {
    // Implementar búsqueda de productos
    console.log('Buscando productos:', query);
}

// Update datetime every second
setInterval(updateDateTime, 1000);
updateDateTime(); 