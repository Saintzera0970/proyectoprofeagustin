// Inicializar los iconos de Lucide
lucide.createIcons();

// Variables globales
let paginaActual = 1;
const ventasPorPagina = 10;
let ventasFiltradas = [];
let todasLasVentas = [];

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

// Función para cargar las ventas desde el servidor
async function cargarVentas() {
    try {
        const response = await fetch('/api/ventas');
        if (!response.ok) {
            throw new Error('Error al cargar las ventas');
        }
        todasLasVentas = await response.json();
        ventasFiltradas = [...todasLasVentas];
        actualizarTabla();
        actualizarResumen();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', 'No se pudieron cargar las ventas');
    }
}

// Función para aplicar los filtros
function aplicarFiltros() {
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;
    const cliente = document.getElementById('clienteFilter').value.toLowerCase();
    const metodoPago = document.getElementById('metodoPagoFilter').value;

    ventasFiltradas = todasLasVentas.filter(venta => {
        const fechaVenta = new Date(venta.createdAt);
        const cumpleFechaDesde = !fechaDesde || fechaVenta >= new Date(fechaDesde);
        const cumpleFechaHasta = !fechaHasta || fechaVenta <= new Date(fechaHasta);
        const cumpleCliente = !cliente || venta.clientName.toLowerCase().includes(cliente);
        const cumpleMetodoPago = !metodoPago || venta.payMethod === metodoPago;

        return cumpleFechaDesde && cumpleFechaHasta && cumpleCliente && cumpleMetodoPago;
    });

    paginaActual = 1;
    actualizarTabla();
    actualizarResumen();
}

// Función para actualizar la tabla de ventas
function actualizarTabla() {
    const tabla = document.getElementById('tablaVentas');
    const inicio = (paginaActual - 1) * ventasPorPagina;
    const fin = inicio + ventasPorPagina;
    const ventasPagina = ventasFiltradas.slice(inicio, fin);

    tabla.innerHTML = '';

    ventasPagina.forEach(venta => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        
        const fecha = new Date(venta.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${fecha}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${venta.clientName}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMetodoPagoClass(venta.payMethod)}">
                    ${formatMetodoPago(venta.payMethod)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                $${venta.totalAmount.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${venta.delivery ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${venta.delivery ? 'Sí' : 'No'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="verDetalles('${venta.id}')" class="text-primary hover:text-primary-dark mr-3">
                    <i data-lucide="eye" class="w-5 h-5"></i>
                </button>
                <button onclick="descargarComprobante('${venta.id}')" class="text-gray-600 hover:text-gray-900">
                    <i data-lucide="file-text" class="w-5 h-5"></i>
                </button>
            </td>
        `;
        
        tabla.appendChild(tr);
    });

    lucide.createIcons();
    actualizarPaginacion();
}

// Función para actualizar el resumen
function actualizarResumen() {
    const totalVentas = ventasFiltradas.length;
    const ingresosTotales = ventasFiltradas.reduce((total, venta) => total + venta.totalAmount, 0);
    const productosVendidos = ventasFiltradas.reduce((total, venta) => 
        total + venta.productId.reduce((sum, prod) => sum + prod.quantity, 0), 0);
    const promedioVenta = totalVentas > 0 ? ingresosTotales / totalVentas : 0;

    document.getElementById('totalVentas').textContent = totalVentas;
    document.getElementById('ingresosTotales').textContent = `$${ingresosTotales.toFixed(2)}`;
    document.getElementById('productosVendidos').textContent = productosVendidos;
    document.getElementById('promedioVenta').textContent = `$${promedioVenta.toFixed(2)}`;
}

// Función para actualizar la paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
    const inicio = (paginaActual - 1) * ventasPorPagina + 1;
    const fin = Math.min(paginaActual * ventasPorPagina, ventasFiltradas.length);

    document.getElementById('resultadosActuales').textContent = `${inicio}-${fin}`;
    document.getElementById('totalResultados').textContent = ventasFiltradas.length;

    document.getElementById('btnAnterior').disabled = paginaActual === 1;
    document.getElementById('btnSiguiente').disabled = paginaActual >= totalPaginas;
}

// Función para cambiar de página
function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
    
    if (direccion === 'anterior' && paginaActual > 1) {
        paginaActual--;
    } else if (direccion === 'siguiente' && paginaActual < totalPaginas) {
        paginaActual++;
    }

    actualizarTabla();
}

// Función para ver detalles de una venta
async function verDetalles(ventaId) {
    try {
        const venta = todasLasVentas.find(v => v.id === ventaId);
        if (!venta) {
            throw new Error('Venta no encontrada');
        }
        
        const detallesContainer = document.getElementById('detallesVenta');
        detallesContainer.innerHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Cliente</p>
                        <p class="text-base font-medium">${venta.clientName}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Fecha</p>
                        <p class="text-base font-medium">${new Date(venta.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Método de Pago</p>
                        <p class="text-base font-medium">${formatMetodoPago(venta.payMethod)}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Delivery</p>
                        <p class="text-base font-medium">${venta.delivery ? 'Sí' : 'No'}</p>
                    </div>
                </div>

                <div>
                    <p class="text-sm text-gray-600 mb-2">Descripción</p>
                    <p class="text-base">${venta.description || 'Sin descripción'}</p>
                </div>

                <div class="border-t pt-4 mt-4">
                    <div class="flex justify-between items-center text-lg font-semibold">
                        <span>Total</span>
                        <span>$${venta.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalDetalles').classList.remove('hidden');
        document.getElementById('modalDetalles').classList.add('flex');
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', 'No se pudieron cargar los detalles de la venta');
    }
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('modalDetalles').classList.add('hidden');
    document.getElementById('modalDetalles').classList.remove('flex');
}

// Función para exportar ventas
function exportarVentas() {
    const csvContent = generarCSV(ventasFiltradas);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
    
    link.href = URL.createObjectURL(blob);
    link.download = `ventas_${fecha}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Función para generar CSV
function generarCSV(ventas) {
    const headers = ['Fecha', 'Cliente', 'Método de Pago', 'Total', 'Delivery', 'Descripción'];
    const rows = ventas.map(venta => [
        new Date(venta.createdAt).toLocaleDateString('es-ES'),
        venta.clientName,
        formatMetodoPago(venta.payMethod),
        venta.totalAmount.toFixed(2),
        venta.delivery ? 'Sí' : 'No',
        venta.description || ''
    ]);

    return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
}

// Función para formatear el método de pago
function formatMetodoPago(metodo) {
    const formatos = {
        'efectivo': 'Efectivo',
        'transferencia': 'Transferencia',
        'cuenta_corriente': 'Cuenta Corriente',
        'tarjeta': 'Tarjeta'
    };
    return formatos[metodo] || metodo;
}

// Función para obtener la clase CSS del método de pago
function getMetodoPagoClass(metodo) {
    const clases = {
        'efectivo': 'bg-green-100 text-green-800',
        'transferencia': 'bg-blue-100 text-blue-800',
        'cuenta_corriente': 'bg-amber-100 text-amber-800',
        'tarjeta': 'bg-purple-100 text-purple-800'
    };
    return clases[metodo] || 'bg-gray-100 text-gray-800';
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-fade-in z-50';
    notificacion.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <i data-lucide="bell" class="w-6 h-6 text-primary"></i>
            </div>
            <div>
                <h4 class="text-sm font-medium text-gray-900">${titulo}</h4>
                <p class="text-sm text-gray-500">${mensaje}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>
    `;
    document.body.appendChild(notificacion);
    lucide.createIcons();

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Cargar las ventas al iniciar
document.addEventListener('DOMContentLoaded', cargarVentas); 