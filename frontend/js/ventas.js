// Inicializar los iconos de Lucide
lucide.createIcons();

// Agregar event listener para el botón Finalizar Venta
document.getElementById('finalizarVentaBtn').addEventListener('click', finalizarVenta);

// Variables globales para cuenta corriente
let clienteSeleccionado = null;

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

    // Mostrar u ocultar el recargo de transferencia
    const recargoElement = document.getElementById('recargo-transferencia');
    if (method === 'transferencia') {
        recargoElement.classList.remove('hidden');
        // Limpiar el campo de vuelto si existe
        const vueltoElement = document.getElementById('vuelto');
        if (vueltoElement) {
            vueltoElement.textContent = '$0.00';
        }
        const montoRecibidoInput = document.querySelector('input[onchange^="calcularVuelto"]');
        if (montoRecibidoInput) {
            montoRecibidoInput.value = '';
        }
        actualizarRecargoTransferencia(document.querySelector('input[onchange="actualizarRecargoTransferencia(this.value)"]').value);
    } else {
        recargoElement.classList.add('hidden');
        actualizarTotales();
    }
}

function calcularVuelto(montoRecibido) {
    const metodoPago = document.querySelector('input[name="payment_method"]:checked');
    if (!metodoPago || metodoPago.value !== 'efectivo') {
        return;
    }

    const totalElement = document.querySelector('[data-total="total"]');
    const total = parseFloat(totalElement.textContent.replace('$', '')) || 0;
    const vuelto = parseFloat(montoRecibido) - total;
    
    document.getElementById('vuelto').textContent = vuelto >= 0 ? 
        `$${vuelto.toFixed(2)}` : 
        `Falta: $${Math.abs(vuelto).toFixed(2)}`;
}

async function searchProducts(query) {
    const productos = await fetchProducts();
    if (!query.trim()) {
        document.getElementById('resultadosBusqueda').classList.add('hidden');
        return;
    }

    const queryLower = query.toLowerCase().trim();
    const resultados = productos.filter(producto => 
        producto.name.toLowerCase().includes(queryLower) ||
        producto.brand.toLowerCase().includes(queryLower) ||
        producto.category.toLowerCase().includes(queryLower)
    );

    mostrarResultados(resultados);
}

// Función para mostrar los resultados de la búsqueda
function mostrarResultados(resultados) {
    const contenedor = document.getElementById('resultadosBusqueda');
    contenedor.innerHTML = '';
    contenedor.classList.remove('hidden');

    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                <i data-lucide="search-x" class="w-6 h-6 mx-auto mb-2 text-gray-400"></i>
                <p>No se encontraron productos</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    resultados.forEach(producto => {
        const itemProducto = document.createElement('div');
        itemProducto.className = 'p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150';
        itemProducto.innerHTML = `
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center flex-1 min-w-0">
                    <div class="h-14 w-14 flex-shrink-0 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                        <i data-lucide="package" class="w-7 h-7 text-primary"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-base font-medium text-gray-900 truncate mb-0.5">${producto.name}</div>
                        <div class="text-sm text-gray-500 truncate flex items-center gap-2">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100">
                                ${producto.brand}
                            </span>
                            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                ${producto.category}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="text-lg font-semibold text-primary whitespace-nowrap">$${producto.price}</div>
                    <button class="p-2 hover:bg-primary/10 rounded-lg transition-colors duration-150 group">
                        <i data-lucide="plus-circle" class="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors duration-150"></i>
                    </button>
                </div>
            </div>
        `;
        
        itemProducto.onclick = () => agregarProductoAVenta(producto);
        contenedor.appendChild(itemProducto);
    });

    // Reinicializar los iconos de Lucide para los nuevos elementos
    lucide.createIcons();
}

// Función para agregar un producto a la venta
function agregarProductoAVenta(producto) {
    const productList = document.getElementById('productList');
    
    // Verificar si el producto ya está en la lista
    const productoExistente = document.querySelector(`[data-codigo="${producto.id}"]`);
    if (productoExistente) {
        const inputCantidad = productoExistente.querySelector('input[type="number"]');
        inputCantidad.value = parseInt(inputCantidad.value) + 1;
        actualizarSubtotal(productoExistente, producto.price, inputCantidad.value);
    } else {
        const tr = document.createElement('tr');
        tr.className = 'product-item';
        tr.setAttribute('data-codigo', producto.id);
        tr.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                        <i data-lucide="package" class="w-5 h-5 text-primary"></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${producto.name}</div>
                        <div class="text-sm text-gray-500">${producto.brand} - ${producto.category}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                    <button class="text-gray-400 hover:text-primary" onclick="modificarCantidad(this, -1)">
                        <i data-lucide="minus-circle" class="w-5 h-5"></i>
                    </button>
                    <input type="number" value="1" min="1" class="w-16 text-center input-field py-1" 
                           onchange="actualizarSubtotal(this.closest('tr'), ${producto.price}, this.value)">
                    <button class="text-gray-400 hover:text-primary" onclick="modificarCantidad(this, 1)">
                        <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    </button>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">$${producto.price}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900 subtotal">$${producto.price}</td>
            <td class="px-6 py-4 text-right">
                <button class="text-red-400 hover:text-red-600" onclick="eliminarProducto(this)">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        `;
        
        productList.appendChild(tr);
        lucide.createIcons();
    }
    
    actualizarTotales();
    document.getElementById('resultadosBusqueda').classList.add('hidden');
}

// Función para modificar la cantidad de un producto
function modificarCantidad(btn, delta) {
    const input = btn.parentElement.querySelector('input');
    const newValue = Math.max(1, parseInt(input.value) + delta);
    input.value = newValue;
    
    const tr = btn.closest('tr');
    const precio = parseFloat(tr.querySelector('td:nth-child(3)').textContent.replace('$', ''));
    actualizarSubtotal(tr, precio, newValue);
}

// Función para actualizar el subtotal de un producto
function actualizarSubtotal(tr, precio, cantidad) {
    const subtotal = precio * cantidad;
    tr.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    actualizarTotales();
}

// Función para eliminar un producto
function eliminarProducto(btn) {
    btn.closest('tr').remove();
    actualizarTotales();
}

// Función para actualizar el recargo por transferencia
function actualizarRecargoTransferencia(porcentaje) {
    const subtotalElement = document.querySelector('[data-total="subtotal"]');
    const recargoElement = document.querySelector('[data-total="recargo"]');
    const totalElement = document.querySelector('[data-total="total"]');

    const subtotal = parseFloat(subtotalElement.textContent.replace('$', '')) || 0;
    const recargo = (subtotal * (parseFloat(porcentaje) / 100)) || 0;
    const total = subtotal + recargo;

    recargoElement.textContent = `$${recargo.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Función para actualizar los totales
function actualizarTotales() {
    let subtotal = 0;
    document.querySelectorAll('.subtotal').forEach(elem => {
        subtotal += parseFloat(elem.textContent.replace('$', ''));
    });
    
    document.querySelector('[data-total="subtotal"]').textContent = `$${subtotal.toFixed(2)}`;

    // Si está seleccionado el método de transferencia, recalcular el recargo
    const metodoPago = document.querySelector('input[name="payment_method"]:checked');
    if (metodoPago && metodoPago.value === 'transferencia') {
        const porcentaje = document.querySelector('input[onchange="actualizarRecargoTransferencia(this.value)"]').value;
        actualizarRecargoTransferencia(porcentaje);
    } else {
        document.querySelector('[data-total="total"]').textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// Update datetime every second
setInterval(updateDateTime, 1000);
updateDateTime();

// Función para limpiar la venta actual
function cancelarVenta() {
    // Limpiar la lista de productos
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    // Reiniciar los totales
    document.querySelector('[data-total="subtotal"]').textContent = '$0.00';
    document.querySelector('[data-total="recargo"]').textContent = '$0.00';
    document.querySelector('[data-total="total"]').textContent = '$0.00';

    // Ocultar recargo de transferencia
    document.getElementById('recargo-transferencia').classList.add('hidden');

    // Limpiar la búsqueda
    const inputBusqueda = document.querySelector('input[type="text"]');
    if (inputBusqueda) {
        inputBusqueda.value = '';
    }
    document.getElementById('resultadosBusqueda').classList.add('hidden');

    // Reiniciar método de pago
    const metodoPagoDefault = document.querySelector('input[name="payment_method"]');
    if (metodoPagoDefault) {
        metodoPagoDefault.checked = false;
    }
    document.querySelectorAll('.payment-fields').forEach(fields => {
        fields.classList.add('hidden');
    });
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });

    // Mostrar mensaje de confirmación
    mostrarNotificacion('Venta cancelada', 'Se han eliminado todos los productos');
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-fade-in z-50';
    notificacion.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <i data-lucide="check-circle" class="w-6 h-6 text-primary"></i>
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

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

async function buscarClientes(query) {
    if (!query.trim()) {
        document.getElementById('resultadosClientes').classList.add('hidden');
        return;
    }

    try {
        const clientes = await fetchClientes();
        const resultados = clientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(query.toLowerCase()) ||
            cliente.dni.includes(query)
        );

        mostrarResultadosClientes(resultados);
    } catch (error) {
        console.error('Error al buscar clientes:', error);
    }
}

function mostrarResultadosClientes(resultados) {
    const contenedor = document.getElementById('resultadosClientes');
    contenedor.innerHTML = '';
    contenedor.classList.remove('hidden');

    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                <p>No se encontraron clientes</p>
            </div>
        `;
        return;
    }

    resultados.forEach(cliente => {
        const div = document.createElement('div');
        div.className = 'p-3 hover:bg-gray-50 cursor-pointer';
        div.innerHTML = `
            <div class="flex items-center">
                <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">${cliente.nombre}</div>
                    <div class="text-sm text-gray-500">DNI: ${cliente.dni}</div>
                </div>
                <div class="text-sm text-gray-600">
                    Deuda: $${cliente.deuda.toFixed(2)}
                </div>
            </div>
        `;
        div.onclick = () => seleccionarCliente(cliente);
        contenedor.appendChild(div);
    });
}

function seleccionarCliente(cliente) {
    clienteSeleccionado = cliente;
    
    // Mostrar información del cliente
    document.getElementById('infoCliente').classList.remove('hidden');
    document.getElementById('estadoCuenta').classList.remove('hidden');
    document.getElementById('nombreCliente').textContent = cliente.nombre;
    document.getElementById('dniCliente').textContent = `DNI: ${cliente.dni}`;
    
    // Ocultar resultados de búsqueda
    document.getElementById('resultadosClientes').classList.add('hidden');
    
    // Actualizar estado de cuenta
    actualizarEstadoCuenta();
}

function limpiarClienteSeleccionado() {
    clienteSeleccionado = null;
    document.getElementById('infoCliente').classList.add('hidden');
    document.getElementById('estadoCuenta').classList.add('hidden');
    document.getElementById('errorCuentaCorriente').classList.add('hidden');
    document.querySelector('input[placeholder="Buscar cliente..."]').value = '';
}

function actualizarEstadoCuenta() {
    if (!clienteSeleccionado) return;

    const limiteCredito = clienteSeleccionado.limiteCredito || 50000; // Valor por defecto
    const deudaActual = clienteSeleccionado.deuda || 0;
    const disponible = limiteCredito - deudaActual;
    const porcentajeUtilizado = (deudaActual / limiteCredito) * 100;

    // Actualizar montos
    document.getElementById('limiteCredito').textContent = `$${limiteCredito.toFixed(2)}`;
    document.getElementById('deudaActual').textContent = `$${deudaActual.toFixed(2)}`;
    document.getElementById('disponible').textContent = `$${disponible.toFixed(2)}`;
    
    // Actualizar barra de progreso
    document.getElementById('barraDeuda').style.width = `${porcentajeUtilizado}%`;

    // Actualizar información de nueva compra
    const montoNuevaCompra = obtenerTotalActual();
    const deudaResultante = deudaActual + montoNuevaCompra;
    
    document.getElementById('montoNuevaCompra').textContent = `$${montoNuevaCompra.toFixed(2)}`;
    document.getElementById('deudaResultante').textContent = `$${deudaResultante.toFixed(2)}`;

    // Validar si excede el límite
    const errorContainer = document.getElementById('errorCuentaCorriente');
    if (deudaResultante > limiteCredito) {
        errorContainer.classList.remove('hidden');
        document.getElementById('mensajeError').textContent = 
            'La compra excede el límite de crédito disponible';
    } else {
        errorContainer.classList.add('hidden');
    }
}

// Función para crear el objeto de venta
function crearObjetoVenta() {
    const metodoPago = document.querySelector('input[name="payment_method"]:checked');
    const productos = obtenerProductosVenta();
    const total = parseFloat(document.querySelector('[data-total="total"]').textContent.replace('$', '')) || 0;
    
    const venta = {
        clientName: clienteSeleccionado ? clienteSeleccionado.nombre : "Cliente General",
        payMethod: metodoPago ? metodoPago.value : "efectivo",
        delivery: document.getElementById('ventaDelivery').checked,
        totalAmount: total,
        description: document.getElementById('ventaDescripcion').value.trim(),
        productId: productos.map(producto => ({
            id: parseInt(document.querySelector(`tr[data-codigo]`).getAttribute('data-codigo')),
            quantity: producto.cantidad
        }))
    };

    return venta;
}

async function finalizarVenta() {
    try {
        // Validaciones básicas
        const productos = obtenerProductosVenta();
        if (productos.length === 0) {
            mostrarNotificacion('Error', 'No hay productos en la venta');
            return;
        }

        const metodoPago = document.querySelector('input[name="payment_method"]:checked');
        if (!metodoPago) {
            mostrarNotificacion('Error', 'Seleccione un método de pago');
            return;
        }

        // Validaciones específicas por método de pago
        if (metodoPago.value === 'cuenta_corriente' && !clienteSeleccionado) {
            mostrarNotificacion('Error', 'Seleccione un cliente para cuenta corriente');
            return;
        }

        // Crear el objeto de venta
        const objetoVenta = crearObjetoVenta();
        console.log('Objeto de venta creado:', objetoVenta);

        // Aquí puedes agregar la lógica para enviar el objeto de venta al servidor
        try {
            const response = await fetch('/api/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objetoVenta)
            });

            if (!response.ok) {
                throw new Error('Error al enviar la venta al servidor');
            }

            // Mostrar notificación de éxito
            mostrarNotificacion('Éxito', 'Venta finalizada correctamente');

            // Limpiar el formulario
            cancelarVenta();
        } catch (error) {
            console.error('Error al enviar la venta:', error);
            mostrarNotificacion('Error', 'Error al enviar la venta al servidor');
        }
        
    } catch (error) {
        console.error('Error al finalizar la venta:', error);
        mostrarNotificacion('Error', 'Ocurrió un error al finalizar la venta');
    }
}

function obtenerTotalActual() {
    const totalElement = document.querySelector('[data-total="total"]');
    return parseFloat(totalElement.textContent.replace('$', '')) || 0;
}

function obtenerProductosVenta() {
    const productos = [];
    document.querySelectorAll('#productList tr').forEach(tr => {
        const nombre = tr.querySelector('.text-gray-900').textContent;
        const cantidad = parseInt(tr.querySelector('input[type="number"]').value);
        const precio = parseFloat(tr.querySelector('.subtotal').textContent.replace('$', ''));
        productos.push({ nombre, cantidad, precio });
    });
    return productos;
}

function returnventas(){
    const ventas = obtenerProductosVenta();
}

// Modificar la función actualizarTotales para que actualice también el estado de cuenta
const actualizarTotalesOriginal = actualizarTotales;
actualizarTotales = function() {
    actualizarTotalesOriginal();
    if (document.querySelector('input[value="cuenta_corriente"]:checked')) {
        actualizarEstadoCuenta();
    }
}; 