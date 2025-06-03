// Inicializar los iconos de Lucide
lucide.createIcons();

// Variables globales
let todasLasVentas = [];
let ventasFiltradas = [];
let paginaActual = 1;
const ventasPorPagina = 10;

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
        console.log('Cargando ventas...');
        const response = await fetch('http://localhost:1000/ventas');
        if (!response.ok) {
            throw new Error('Error al cargar las ventas');
        }
        const data = await response.json();
        console.log('Datos recibidos:', data);
        todasLasVentas = data;
        ventasFiltradas = [...todasLasVentas];
        actualizarEstadisticas();
        actualizarTabla();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', 'No se pudieron cargar las ventas');
    }
}

// Función para actualizar las estadísticas
function actualizarEstadisticas() {
    const totalVentas = ventasFiltradas.length;
    const montoTotal = ventasFiltradas.reduce((sum, venta) => sum + venta.totalAmount, 0);
    const promedioVenta = totalVentas > 0 ? montoTotal / totalVentas : 0;
    
    // Calcular ventas del mes actual
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ventasMes = ventasFiltradas.filter(venta => 
        new Date(venta.createdAt) >= primerDiaMes
    ).length;

    document.getElementById('totalVentas').textContent = totalVentas;
    document.getElementById('ventasMes').textContent = ventasMes;
    document.getElementById('montoTotal').textContent = `$${montoTotal.toFixed(2)}`;
    document.getElementById('promedioVenta').textContent = `$${promedioVenta.toFixed(2)}`;
}

// Función para actualizar la tabla de ventas
function actualizarTabla() {
    const tabla = document.getElementById('tablaVentas');
    const inicio = (paginaActual - 1) * ventasPorPagina;
    const fin = inicio + ventasPorPagina;
    const ventasPagina = ventasFiltradas.slice(inicio, fin);

    tabla.innerHTML = '';

    ventasPagina.forEach(venta => {
        const fecha = new Date(venta.createdAt).toLocaleString();
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${fecha}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${venta.Cliente ? venta.Cliente.nombre : 'Sin cliente'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${venta.Empleado ? venta.Empleado.nombre : 'N/A'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${venta.payMethod}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                $${venta.totalAmount.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="mostrarDetalles(${venta.id})" class="text-primary hover:text-primary-dark">
                    Ver detalles
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Actualizar información de paginación
    document.getElementById('desde').textContent = ventasFiltradas.length ? inicio + 1 : 0;
    document.getElementById('hasta').textContent = Math.min(fin, ventasFiltradas.length);
    document.getElementById('total').textContent = ventasFiltradas.length;

    // Actualizar estado de botones de paginación
    document.getElementById('btnAnterior').disabled = paginaActual === 1;
    document.getElementById('btnSiguiente').disabled = fin >= ventasFiltradas.length;
}

// Función para mostrar detalles de una venta
async function mostrarDetalles(ventaId) {
    try {
        const venta = ventasFiltradas.find(v => v.id === ventaId);
        if (!venta) return;

        const detallesContainer = document.getElementById('detallesVenta');
        detallesContainer.innerHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Información General</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p><span class="font-medium">Fecha:</span> ${new Date(venta.createdAt).toLocaleString()}</p>
                            <p><span class="font-medium">Cliente:</span> ${venta.Cliente ? venta.Cliente.nombre : 'Sin cliente'}</p>
                            <p><span class="font-medium">Vendedor:</span> ${venta.Empleado ? venta.Empleado.nombre : 'N/A'}</p>
                            <p><span class="font-medium">Método de pago:</span> ${venta.payMethod}</p>
                            <p><span class="font-medium">Delivery:</span> ${venta.delivery ? 'Sí' : 'No'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Resumen</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p><span class="font-medium">Total:</span> $${venta.totalAmount.toFixed(2)}</p>
                            <p><span class="font-medium">Descripción:</span> ${venta.description || 'Sin descripción'}</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Productos</h3>
                    <div class="bg-gray-50 rounded-lg overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${venta.detalles.map(detalle => `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${detalle.producto ? detalle.producto.name : 'Producto no disponible'}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${detalle.quantity}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            $${detalle.unitPrice.toFixed(2)}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            $${detalle.totalPrice.toFixed(2)}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalDetalles').classList.remove('hidden');
    } catch (error) {
        console.error('Error al mostrar detalles:', error);
        mostrarNotificacion('Error', 'No se pudieron cargar los detalles de la venta');
    }
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('modalDetalles').classList.add('hidden');
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
        const cumpleCliente = !cliente || 
            (venta.Cliente && venta.Cliente.nombre.toLowerCase().includes(cliente));
        const cumpleMetodoPago = !metodoPago || venta.payMethod === metodoPago;

        return cumpleFechaDesde && cumpleFechaHasta && cumpleCliente && cumpleMetodoPago;
    });

    paginaActual = 1;
    actualizarEstadisticas();
    actualizarTabla();
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50';
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

// Event listeners para paginación
document.getElementById('btnAnterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        actualizarTabla();
    }
});

document.getElementById('btnSiguiente').addEventListener('click', () => {
    const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        actualizarTabla();
    }
});

// Cargar ventas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
}); 