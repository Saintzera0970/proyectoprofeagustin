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

// Función para cargar las ventas desde el servidor
async function cargarVentas() {
    try {
        const response = await fetch('http://localhost:1000/ventas');
        const ventas = await response.json();
        ventasTotales = ventas;
        actualizarEstadisticas(ventas);
        mostrarVentas(ventas);
    } catch (error) {
        console.error('Error al cargar las ventas:', error);
        mostrarNotificacion('Error', 'No se pudieron cargar las ventas');
    }
}

// Función para actualizar las estadísticas
function actualizarEstadisticas(ventas) {
    // Total de ventas
    document.getElementById('totalVentas').textContent = ventas.length;

    // Ventas del mes actual
    const mesActual = new Date().getMonth();
    const ventasMes = ventas.filter(venta => {
        const fechaVenta = new Date(venta.createdAt);
        return fechaVenta.getMonth() === mesActual;
    }).length;
    document.getElementById('ventasMes').textContent = ventasMes;

    // Monto total
    const montoTotal = ventas.reduce((total, venta) => {
        return total + calcularTotalVenta(venta);
    }, 0);
    document.getElementById('montoTotal').textContent = `$${montoTotal.toFixed(2)}`;

    // Promedio por venta
    const promedio = ventas.length > 0 ? montoTotal / ventas.length : 0;
    document.getElementById('promedioVenta').textContent = `$${promedio.toFixed(2)}`;
}

// Función para calcular el total de una venta
function calcularTotalVenta(venta) {
    return venta.totalAmount || 0;
}

// Función para formatear fecha y hora
function formatearFechaHora(fecha) {
    return new Date(fecha).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// Función para mostrar las ventas en la tabla
function mostrarVentas(ventas) {
    const tabla = document.getElementById('tablaVentas');
    tabla.innerHTML = '';

    const inicio = (paginaActual - 1) * ventasPorPagina;
    const fin = inicio + ventasPorPagina;
    const ventasPagina = ventas.slice(inicio, fin);

    ventasPagina.forEach(venta => {
        const fila = document.createElement('tr');
        fila.className = 'hover:bg-gray-50';
        fila.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formatearFechaHora(venta.createdAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${venta.Cliente ? venta.Cliente.nombre : 'Sin cliente'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${venta.Empleado ? venta.Empleado.nombre : 'No disponible'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${venta.payMethod}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                $${venta.totalAmount.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="mostrarDetalles('${venta.id}')" class="text-primary hover:text-primary-dark">
                    <i data-lucide="eye" class="w-5 h-5"></i>
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Actualizar la paginación
    actualizarPaginacion(ventas.length);
    lucide.createIcons();
}

// Función para actualizar la paginación
function actualizarPaginacion(totalVentas) {
    const totalPaginas = Math.ceil(totalVentas / ventasPorPagina);
    const desde = ((paginaActual - 1) * ventasPorPagina) + 1;
    const hasta = Math.min(paginaActual * ventasPorPagina, totalVentas);

    document.getElementById('desde').textContent = totalVentas === 0 ? 0 : desde;
    document.getElementById('hasta').textContent = hasta;
    document.getElementById('total').textContent = totalVentas;

    // Habilitar/deshabilitar botones de paginación
    document.getElementById('btnAnterior').disabled = paginaActual === 1;
    document.getElementById('btnSiguiente').disabled = paginaActual >= totalPaginas;
}

// Función para mostrar los detalles de una venta
async function mostrarDetalles(ventaId) {
    try {
        const response = await fetch(`http://localhost:1000/ventas/${ventaId}`);
        const venta = await response.json();

        const detallesContainer = document.getElementById('detallesVenta');
        detallesContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">Información General</h3>
                    <p class="text-sm text-gray-600">Fecha y Hora: ${formatearFechaHora(venta.createdAt)}</p>
                    <p class="text-sm text-gray-600">Cliente: ${venta.Cliente ? venta.Cliente.nombre : 'Sin cliente'}</p>
                    <p class="text-sm text-gray-600">DNI Cliente: ${venta.Cliente ? venta.Cliente.dni : 'N/A'}</p>
                    <p class="text-sm text-gray-600">Vendedor: ${venta.Empleado ? venta.Empleado.nombre : 'N/A'}</p>
                    <p class="text-sm text-gray-600">Método de Pago: ${venta.payMethod}</p>
                    <p class="text-sm text-gray-600">Delivery: ${venta.delivery ? 'Sí' : 'No'}</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">Detalles del Pago</h3>
                    <p class="text-sm text-gray-600">Total: $${venta.totalAmount.toFixed(2)}</p>
                    <p class="text-sm text-gray-600">Descripción: ${venta.description || 'Sin descripción'}</p>
                </div>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Productos</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${venta.detalles.map(detalle => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${detalle.producto ? `${detalle.producto.name} (${detalle.producto.brand})` : 'Producto no disponible'}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${detalle.quantity}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        $${parseFloat(detalle.unitPrice).toFixed(2)}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        $${parseFloat(detalle.totalPrice).toFixed(2)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('modalDetalles').classList.remove('hidden');
    } catch (error) {
        console.error('Error al cargar los detalles de la venta:', error);
        mostrarNotificacion('Error', 'No se pudieron cargar los detalles de la venta');
    }
}

// Función para cerrar el modal de detalles
function cerrarModal() {
    document.getElementById('modalDetalles').classList.add('hidden');
}

// Función para aplicar filtros
function aplicarFiltros() {
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;
    const cliente = document.getElementById('clienteFilter').value.toLowerCase();
    const metodoPago = document.getElementById('metodoPagoFilter').value;

    let ventasFiltradas = [...ventasTotales];

    if (fechaDesde) {
        ventasFiltradas = ventasFiltradas.filter(venta => 
            new Date(venta.createdAt) >= new Date(fechaDesde)
        );
    }

    if (fechaHasta) {
        ventasFiltradas = ventasFiltradas.filter(venta => 
            new Date(venta.createdAt) <= new Date(fechaHasta)
        );
    }

    if (cliente) {
        ventasFiltradas = ventasFiltradas.filter(venta => 
            venta.Cliente && venta.Cliente.nombre.toLowerCase().includes(cliente)
        );
    }

    if (metodoPago) {
        ventasFiltradas = ventasFiltradas.filter(venta => 
            venta.payMethod === metodoPago
        );
    }

    mostrarVentas(ventasFiltradas);
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje) {
    // Implementar según el diseño de tu sistema de notificaciones
    console.log(`${titulo}: ${mensaje}`);
}

// Event Listeners
document.getElementById('btnAnterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarVentas(ventasTotales);
    }
});

document.getElementById('btnSiguiente').addEventListener('click', () => {
    const totalPaginas = Math.ceil(ventasTotales.length / ventasPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarVentas(ventasTotales);
    }
});

// Cargar las ventas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
}); 