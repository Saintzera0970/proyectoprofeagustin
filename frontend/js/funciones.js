async function fetchProducts() {
    try {
        const response = await fetch('https://back-prof-agustin-2.onrender.com/productos');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const products = await response.json();
        
        // Procesar y validar los datos
        return products.map(product => ({
            ...product,
            price: parseFloat(product.price || 0),
            stock: parseInt(product.stock || 0),
            name: product.name || '',
            category: product.category || '',
            description: product.description || '',
            id: product.id || ''
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Retornar array vacío en caso de error
    }
}

// Función para mostrar el modal del ticket
function showTicketModal(ventaData) {
    const modal = document.getElementById('ticketModal');
    const ticketDateTime = document.getElementById('ticketDateTime');
    const ticketNumber = document.getElementById('ticketNumber');
    const ticketItems = document.getElementById('ticketItems');
    const ticketSubtotal = document.getElementById('ticketSubtotal');
    const ticketTotal = document.getElementById('ticketTotal');
    const ticketPaymentMethod = document.getElementById('ticketPaymentMethod');
    const ticketClientName = document.getElementById('ticketClientName');
    const ticketClientDNI = document.getElementById('ticketClientDNI');
    const ticketSellerName = document.getElementById('ticketSellerName');
    const ticketSellerRole = document.getElementById('ticketSellerRole');
    const ticketRecargoContainer = document.getElementById('ticketRecargoContainer');
    const ticketRecargo = document.getElementById('ticketRecargo');

    // Formatear fecha y hora
    const fecha = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const hora = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
    ticketDateTime.textContent = `${fecha.charAt(0).toUpperCase() + fecha.slice(1)} - ${hora}`;
    
    // Número de ticket
    ticketNumber.textContent = `Ticket #${ventaData.ticketNumber || Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Información del cliente
    if (clienteSeleccionado) {
        ticketClientName.textContent = clienteSeleccionado.nombre;
        ticketClientDNI.textContent = `DNI: ${clienteSeleccionado.dni}`;
    } else {
        ticketClientName.textContent = 'Cliente Ocasional';
        ticketClientDNI.textContent = 'Consumidor Final';
    }
    
    // Información del vendedor
    const empleadoData = JSON.parse(localStorage.getItem('empleadoData'));
    if (empleadoData) {
        ticketSellerName.textContent = empleadoData.nombre;
        ticketSellerRole.textContent = empleadoData.rol || 'Vendedor';
    }
    
    // Limpiar items anteriores
    ticketItems.innerHTML = '';
    
    // Agregar items de la venta
    ventaData.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between text-sm';
        
        itemElement.innerHTML = `
            <div class="w-48 text-gray-800 dark:text-gray-200">${item.name}</div>
            <div class="w-20 text-center text-gray-600 dark:text-gray-400">${item.quantity}</div>
            <div class="w-24 text-right text-gray-800 dark:text-gray-200">$${(item.price * item.quantity).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</div>
        `;
        ticketItems.appendChild(itemElement);
    });
    
    // Mostrar totales con formato de moneda
    const formatoMoneda = (valor) => valor.toLocaleString('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    ticketSubtotal.textContent = `$${formatoMoneda(ventaData.subtotal)}`;
    ticketTotal.textContent = `$${formatoMoneda(ventaData.total)}`;
    
    // Mostrar recargo si existe
    if (ventaData.total > ventaData.subtotal) {
        const recargo = ventaData.total - ventaData.subtotal;
        ticketRecargoContainer.classList.remove('hidden');
        ticketRecargo.textContent = `$${formatoMoneda(recargo)}`;
    } else {
        ticketRecargoContainer.classList.add('hidden');
    }
    
    // Mostrar método de pago
    const metodoPagoTexto = {
        'efectivo': 'Efectivo',
        'transferencia': 'Transferencia Bancaria',
        'cuenta_corriente': 'Cuenta Corriente'
    };
    ticketPaymentMethod.textContent = metodoPagoTexto[ventaData.metodoPago] || ventaData.metodoPago;
    
    // Mostrar el modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Reinicializar los iconos de Lucide
    lucide.createIcons();
}

// Función para enviar el ticket por email
async function enviarTicketPorEmail() {
    // Aquí puedes implementar la lógica para enviar el ticket por email
    mostrarNotificacion('Información', 'Funcionalidad de envío por email en desarrollo', 'info');
}

// Función para cerrar el modal
function closeTicketModal() {
    const modal = document.getElementById('ticketModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Función para imprimir el ticket
function imprimirTicket() {
    const contenidoTicket = document.getElementById('ticketModal').querySelector('.bg-white').innerHTML;
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Ticket de Venta</title>
                <link href="../dist/output.css" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 20px; }
                    @media print {
                        body { width: 80mm; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                ${contenidoTicket}
            </body>
        </html>
    `);
    
    setTimeout(() => {
        ventanaImpresion.print();
        ventanaImpresion.close();
    }, 500);
}