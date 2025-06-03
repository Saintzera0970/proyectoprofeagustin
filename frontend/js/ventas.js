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

// Agregar event listener para el botón Finalizar Venta
document.getElementById('finalizarVentaBtn').addEventListener('click', finalizarVenta);

// Variables globales para cuenta corriente
let clienteSeleccionado = null;

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

// Función para limpiar la venta actual
function cancelarVenta() {
    limpiarFormularioVenta();
    mostrarNotificacion('Venta Cancelada', 'Se han eliminado todos los productos', 'error');
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    const esExito = tipo === 'success';
    
    notificacion.className = `fixed top-4 right-4 ${esExito ? 'bg-green-100' : 'bg-red-100'} rounded-lg shadow-lg p-4 z-50 transition-all duration-300 transform translate-x-full`;
    notificacion.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-10 h-10 ${esExito ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center">
                <i data-lucide="${esExito ? 'check' : 'x'}" class="w-6 h-6 text-white"></i>
            </div>
            <div class="min-w-[200px]">
                <h4 class="text-sm font-medium text-gray-900">${titulo}</h4>
                <p class="text-sm text-gray-700">${mensaje}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-gray-500 hover:text-gray-700">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notificacion);
    lucide.createIcons();

    // Animación de entrada
    requestAnimationFrame(() => {
        notificacion.style.transform = 'translateX(0)';
    });

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion && notificacion.parentElement) {
                notificacion.remove();
            }
        }, 300);
    }, 3000);
}

// Función para mostrar los resultados de clientes
function mostrarResultadosClientes(resultados) {
    const contenedor = document.getElementById('resultadosClientes');
    
    // Si el contenedor no existe, créalo
    if (!contenedor) {
        const nuevoContenedor = document.createElement('div');
        nuevoContenedor.id = 'resultadosClientes';
        nuevoContenedor.className = 'absolute z-50 top-full left-0 right-0 mt-2 bg-[#0f172a] rounded-xl shadow-xl border border-gray-700 max-h-[420px] overflow-y-auto hidden divide-y divide-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 w-full';
        document.querySelector('.relative input[placeholder*="cliente"]').parentElement.appendChild(nuevoContenedor);
    }

    const contenedorActual = document.getElementById('resultadosClientes');
    contenedorActual.innerHTML = '';
    contenedorActual.classList.remove('hidden');

    if (resultados.length === 0) {
        contenedorActual.innerHTML = `
            <div class="p-6 text-center text-gray-400">
                <i data-lucide="search-x" class="w-6 h-6 mx-auto mb-2 text-gray-500"></i>
                <p>No se encontraron clientes</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    resultados.forEach(cliente => {
        const itemCliente = document.createElement('div');
        itemCliente.className = 'p-4 hover:bg-gray-800/50 cursor-pointer transition-colors duration-150';
        itemCliente.innerHTML = `
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center flex-1 min-w-0">
                    <div class="h-10 w-10 flex-shrink-0 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                        <i data-lucide="user" class="w-5 h-5 text-blue-500"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-200">${cliente.nombre}</div>
                        <div class="text-xs text-gray-400">DNI: ${cliente.dni}</div>
                    </div>
                </div>
            </div>
        `;
        
        itemCliente.onclick = () => seleccionarCliente(cliente);
        contenedorActual.appendChild(itemCliente);
    });

    // Reinicializar los iconos de Lucide
    lucide.createIcons();
}

function seleccionarCliente(cliente) {
    clienteSeleccionado = cliente;
    
    // Mostrar el contenedor del cliente seleccionado
    const container = document.getElementById('clienteSeleccionadoContainer');
    const nombreElement = document.getElementById('nombreClienteSeleccionado');
    const dniElement = document.getElementById('dniClienteSeleccionado');
    
    container.classList.remove('hidden');
    nombreElement.textContent = `${cliente.nombre} (ID: ${cliente.id})`;
    dniElement.textContent = `DNI: ${cliente.dni}`;
    
    // Limpiar y ocultar el input de búsqueda
    const inputBusqueda = document.querySelector('input[placeholder*="cliente"]');
    inputBusqueda.value = '';
    document.getElementById('resultadosClientes').classList.add('hidden');
    
    // Reinicializar los iconos de Lucide
    lucide.createIcons();
}

function quitarClienteSeleccionado() {
    clienteSeleccionado = null;
    document.getElementById('clienteSeleccionadoContainer').classList.add('hidden');
    
    // Limpiar el input de búsqueda
    const inputBusqueda = document.querySelector('input[placeholder*="cliente"]');
    if (inputBusqueda) {
        inputBusqueda.value = '';
    }
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
    // Obtener el método de pago seleccionado
    const metodoPagoElement = document.querySelector('input[name="payment_method"]:checked');
    if (!metodoPagoElement) {
        throw new Error('Por favor, seleccione un método de pago');
    }
    const metodoPago = metodoPagoElement.value;
    
    // Obtener el valor del checkbox de delivery
    const deliveryElement = document.getElementById('delivery');
    const delivery = deliveryElement ? deliveryElement.checked : false;
    
    // Obtener la descripción
    const descripcionElement = document.getElementById('descripcion');
    const description = descripcionElement ? descripcionElement.value || '' : '';
    
    // Obtener los productos y sus cantidades
    const productosElements = document.querySelectorAll('.product-item');
    if (!productosElements.length) {
        throw new Error('No hay productos agregados a la venta');
    }
    
    const productos = Array.from(productosElements).map(item => {
        const cantidad = item.querySelector('input[type="number"]');
        if (!cantidad || !cantidad.value) {
            throw new Error('Error al obtener la cantidad de un producto');
        }
        return {
            id: parseInt(item.getAttribute('data-codigo')),
            quantity: parseInt(cantidad.value)
        };
    });
    
    // Obtener el ID del cliente seleccionado
    const clienteId = clienteSeleccionado ? clienteSeleccionado.id.toString() : '';
    
    // Obtener el ID del empleado desde localStorage
    const empleadoData = JSON.parse(localStorage.getItem('empleadoData'));
    if (!empleadoData || !empleadoData.id) {
        throw new Error('No hay información del empleado. Por favor, inicie sesión nuevamente');
    }
    const empleadoId = empleadoData.id.toString();
    
    // Crear el objeto de venta con la estructura requerida
    const ventaObj = {
        payMethod: metodoPago,
        delivery: delivery,
        description: description,
        productId: productos,
        clienteId: clienteId,
        empleadoId: empleadoId
    };
    
    return ventaObj;
}

async function finalizarVenta() {
    try {
        // Validaciones básicas
        const productos = obtenerProductosVenta();
        if (productos.length === 0) {
            mostrarNotificacion('Error', 'No hay productos en la venta', 'error');
            return;
        }

        const metodoPago = document.querySelector('input[name="payment_method"]:checked');
        if (!metodoPago) {
            mostrarNotificacion('Error', 'Seleccione un método de pago', 'error');
            return;
        }

        // Validaciones específicas por método de pago
        if (metodoPago.value === 'cuenta_corriente' && !clienteSeleccionado) {
            mostrarNotificacion('Error', 'Seleccione un cliente para cuenta corriente', 'error');
            return;
        }

        // Crear el objeto de venta
        const objetoVenta = crearObjetoVenta();
        console.log('Objeto de venta creado:', objetoVenta);

        // Enviar la venta al servidor
        const response = await fetch('https://back-prof-agustin-2.onrender.com/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objetoVenta)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || responseData.error || 'Error al procesar la venta');
        }

        // Preparar datos para el ticket
        const ventaData = {
            items: productos.map(prod => {
                const tr = document.querySelector(`[data-codigo="${prod.id}"]`);
                return {
                    name: tr.querySelector('.text-sm.font-medium').textContent,
                    quantity: prod.cantidad,
                    price: parseFloat(tr.querySelector('td:nth-child(3)').textContent.replace('$', ''))
                };
            }),
            subtotal: parseFloat(document.querySelector('[data-total="subtotal"]').textContent.replace('$', '')),
            total: parseFloat(document.querySelector('[data-total="total"]').textContent.replace('$', '')),
            metodoPago: metodoPago.value
        };

        // Mostrar el modal del ticket
        showTicketModal(ventaData);

        // Mostrar notificación de éxito
        mostrarNotificacion('Venta Exitosa', 'La venta se ha registrado correctamente', 'success');

        // Limpiar el formulario después de mostrar el éxito
        limpiarFormularioVenta();

    } catch (error) {
        console.error('Error al finalizar la venta:', error);
        const mensajeError = typeof error === 'string' ? error : 
                           error.message || 'Ocurrió un error al finalizar la venta';
        mostrarNotificacion('Error', mensajeError, 'error');
    }
}

// Función para limpiar el formulario después de una venta
function limpiarFormularioVenta() {
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

    // Limpiar cliente seleccionado si existe
    if (clienteSeleccionado) {
        quitarClienteSeleccionado();
    }
}

function obtenerTotalActual() {
    const totalElement = document.querySelector('[data-total="total"]');
    return parseFloat(totalElement.textContent.replace('$', '')) || 0;
}

function obtenerProductosVenta() {
    const productos = [];
    document.querySelectorAll('#productList tr').forEach(tr => {
        const id = tr.getAttribute('data-codigo');
        const cantidadInput = tr.querySelector('input[type="number"]');
        
        if (!id || !cantidadInput || !cantidadInput.value) {
            throw new Error('Datos de producto inválidos');
        }
        
        const cantidad = parseInt(cantidadInput.value);
        if (isNaN(cantidad) || cantidad <= 0) {
            throw new Error('La cantidad debe ser un número mayor a 0');
        }
        
        productos.push({ 
            id: parseInt(id),
            cantidad: cantidad
        });
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

// Función para buscar clientes
async function buscarClientes(query = '') {
    try {
        // Obtener todos los clientes
        const response = await fetch('https://back-prof-agustin-2.onrender.com/clientes');
        const clientes = await response.json();

        // Si no hay consulta, mostrar todos los clientes
        if (!query.trim()) {
            mostrarResultadosClientes(clientes);
            return;
        }

        // Filtrar clientes según la búsqueda
        const queryLower = query.toLowerCase().trim();
        const resultados = clientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(queryLower) ||
            cliente.dni.toLowerCase().includes(queryLower)
        );

        mostrarResultadosClientes(resultados);
    } catch (error) {
        console.error('Error al buscar clientes:', error);
        mostrarNotificacion(
            'Error',
            'No se pudieron cargar los clientes. Por favor, intente nuevamente.',
            'error'
        );
    }
}

// Agregar el event listener al input de búsqueda de clientes
document.addEventListener('DOMContentLoaded', function() {
    const inputCliente = document.querySelector('input[placeholder*="cliente"]');
    if (inputCliente) {
        // Mostrar todos los clientes al hacer foco en el input
        inputCliente.addEventListener('focus', () => buscarClientes());
        
        // Filtrar clientes mientras se escribe
        inputCliente.addEventListener('input', (e) => buscarClientes(e.target.value));
    }

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        const resultadosClientes = document.getElementById('resultadosClientes');
        const inputCliente = document.querySelector('input[placeholder*="cliente"]');
        
        if (resultadosClientes && !resultadosClientes.contains(e.target) && e.target !== inputCliente) {
            resultadosClientes.classList.add('hidden');
        }
    });
});

// Función para cerrar sesión
function cerrarSesion() {
    // Eliminar datos del empleado del localStorage
    localStorage.removeItem('empleadoData');
    
    // Redirigir al index
    window.location.href = '/frontend/html/index.html';
} 