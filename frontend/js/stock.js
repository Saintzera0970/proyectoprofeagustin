// Inicializar los iconos de Lucide
lucide.createIcons();

// Variables de paginación
let paginaActual = 1;
let elementosPorPagina = 10;
let productos = [];
let productosFiltrados = [];
let timeoutId = null;

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

// Función para normalizar texto (quitar acentos y convertir a minúsculas)
function normalizeText(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

// Función para filtrar productos
function filterProducts(query) {
    query = normalizeText(query);
    
    // Filtrar los productos
    productosFiltrados = !query ? [...productos] : productos.filter(producto => {
        const searchableFields = [
            normalizeText(producto.name),
            normalizeText(producto.category),
            normalizeText(producto.description),
            normalizeText(producto.id),
            normalizeText(producto.price),
            normalizeText(producto.stock)
        ];
        
        return searchableFields.some(field => field.includes(query));
    });

    // Actualizar la tabla con los resultados filtrados
    actualizarTabla();
}

// Función para actualizar la tabla
function actualizarTabla() {
    const productosTableBody = document.getElementById('productsTableBody');
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    // Limpiar la tabla
    productosTableBody.innerHTML = '';

    // Si no hay productos, mostrar mensaje
    if (productosFiltrados.length === 0) {
        productosTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <i data-lucide="search-x" class="w-8 h-8 text-gray-400"></i>
                        <p>No se encontraron productos</p>
                    </div>
                </td>
            </tr>
        `;
        lucide.createIcons();
        actualizarBotonesPaginacion();
        return;
    }

    // Agregar los productos filtrados a la tabla
    productosPagina.forEach(producto => {
        const row = document.createElement('tr');
        row.className = 'transition-all duration-300 ease-in-out';
        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div>
                        <div class="text-sm font-medium text-gray-900">
                            ${producto.name}
                        </div>
                        <div class="text-sm text-gray-500">
                            ${producto.description || 'Sin descripción'}
                        </div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${producto.category}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <button class="mr-2 text-primary hover:text-primary-dark" onclick="adjustStock(${producto.id}, -1)">
                        <i data-lucide="minus-circle" class="w-4 h-4"></i>
                    </button>
                    <span class="text-sm text-gray-900">${producto.stock}</span>
                    <button class="ml-2 text-primary hover:text-primary-dark" onclick="adjustStock(${producto.id}, 1)">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                $${parseFloat(producto.price || 0).toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${producto.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${producto.stock > 10 ? 'En Stock' : 'Stock Bajo'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editProduct(${producto.id})" class="text-primary hover:text-primary-dark mr-2">
                    <i data-lucide="edit" class="w-5 h-5"></i>
                </button>
                <button onclick="deleteProduct(${producto.id})" class="text-red-600 hover:text-red-900">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        `;
        productosTableBody.appendChild(row);
    });

    lucide.createIcons();
    actualizarBotonesPaginacion();
}

// Función para cambiar el número de elementos por página
function cambiarElementosPorPagina(valor) {
    elementosPorPagina = parseInt(valor);
    paginaActual = 1;
    actualizarTabla();
}

// Función para cambiar de página
function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(productosFiltrados.length / elementosPorPagina);
    
    if (direccion === 'anterior' && paginaActual > 1) {
        paginaActual--;
    } else if (direccion === 'siguiente' && paginaActual < totalPaginas) {
        paginaActual++;
    } else if (typeof direccion === 'number' && direccion >= 1 && direccion <= totalPaginas) {
        paginaActual = direccion;
    }
    
    actualizarTabla();
}

// Función para actualizar los botones de paginación
function actualizarBotonesPaginacion() {
    const totalPaginas = Math.ceil(productosFiltrados.length / elementosPorPagina);
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const numeroPaginas = document.getElementById('numeroPaginas');
    const paginaInicio = document.getElementById('paginaInicio');
    const paginaFin = document.getElementById('paginaFin');
    const totalElementos = document.getElementById('totalElementos');
    
    // Actualizar estado de los botones
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;

    // Actualizar números de página
    numeroPaginas.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const botonPagina = document.createElement('button');
        botonPagina.className = `relative inline-flex items-center px-4 py-2 border ${paginaActual === i ? 'bg-primary text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`;
        botonPagina.textContent = i;
        botonPagina.onclick = () => cambiarPagina(i);
        numeroPaginas.appendChild(botonPagina);
    }

    // Actualizar información de elementos mostrados
    const inicio = productosFiltrados.length === 0 ? 0 : ((paginaActual - 1) * elementosPorPagina) + 1;
    const fin = Math.min(paginaActual * elementosPorPagina, productosFiltrados.length);
    
    paginaInicio.textContent = inicio;
    paginaFin.textContent = fin;
    totalElementos.textContent = productosFiltrados.length;
}

// Cargar productos al iniciar
async function cargadeproducto() {
    try {
        productos = await fetchProducts();
        productosFiltrados = [...productos];
        actualizarTabla();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error', 'No se pudieron cargar los productos', 'error');
    }
}

// Iniciar la carga de productos
cargadeproducto();

// Variable global para almacenar el ID del producto en edición
let editingProductId = null;

function toggleNewProduct(isEditing = false) {
    const form = document.getElementById('newProductForm');
    const title = form.querySelector('h2');
    const submitButton = form.querySelector('.btn-primary');
    
    if (form.classList.contains('hidden') || isEditing) {
        form.classList.remove('hidden');
        if (isEditing) {
            title.textContent = 'Editar Producto';
            submitButton.textContent = 'Actualizar';
        } else {
            title.textContent = 'Nuevo Producto';
            submitButton.textContent = 'Guardar';
            // Limpiar el formulario
            form.querySelectorAll('input, textarea').forEach(input => input.value = '');
            editingProductId = null;
        }
    } else {
        form.classList.add('hidden');
        editingProductId = null;
    }
}

async function editProduct(productId) {
    try {
        const productos = await fetchProducts();
        const producto = productos.find(p => p.id === productId);
        if (!producto) {
            mostrarNotificacion('Error', 'Producto no encontrado', 'error');
            return;
        }

        editingProductId = productId;
        const form = document.getElementById('newProductForm');
        
        // Llenar el formulario con los datos del producto
        const inputs = form.querySelectorAll('input, textarea');
        inputs[0].value = producto.name; // Nombre
        inputs[1].value = producto.id; // Código
        inputs[2].value = producto.price; // Precio
        inputs[3].value = producto.stock; // Stock
        inputs[4].value = producto.category; // Categoría
        inputs[5].value = producto.brand || ''; // Proveedor/Marca
        inputs[6].value = producto.description || ''; // Descripción

        toggleNewProduct(true);
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        mostrarNotificacion('Error', 'No se pudo cargar el producto', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
        return;
    }

    try {
        await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        // Eliminar la fila de la tabla
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (row) {
            row.remove();
        }

        mostrarNotificacion('Éxito', 'Producto eliminado correctamente', 'success');
        await cargadeproducto(); // Recargar la tabla
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        mostrarNotificacion('Error', 'No se pudo eliminar el producto', 'error');
    }
}

async function guardarProducto() {
    const form = document.getElementById('newProductForm');
    const inputs = form.querySelectorAll('input, textarea');
    
    const productoData = {
        name: inputs[0].value,
        id: inputs[1].value,
        price: parseFloat(inputs[2].value),
        stock: parseInt(inputs[3].value),
        category: inputs[4].value,
        brand: inputs[5].value,
        description: inputs[6].value
    };

    try {
        const method = editingProductId ? 'PUT' : 'POST';
        const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }

        mostrarNotificacion(
            'Éxito',
            editingProductId ? 'Producto actualizado correctamente' : 'Producto guardado correctamente',
            'success'
        );

        toggleNewProduct();
        await cargadeproducto(); // Recargar la tabla
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', 'No se pudo guardar el producto', 'error');
    }
}

function mostrarNotificacion(titulo, mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-${tipo === 'success' ? 'green' : 'red'}-200 p-4 animate-fade-in z-50`;
    notificacion.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-10 h-10 bg-${tipo === 'success' ? 'green' : 'red'}-100 rounded-full flex items-center justify-center">
                <i data-lucide="${tipo === 'success' ? 'check-circle' : 'alert-circle'}" class="w-6 h-6 text-${tipo === 'success' ? 'green' : 'red'}-600"></i>
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

async function adjustStock(productId, delta = 1) {
    try {
        const productos = await fetchProducts();
        const producto = productos.find(p => p.id === productId);
        if (!producto) {
            mostrarNotificacion('Error', 'Producto no encontrado', 'error');
            return;
        }

        const nuevoStock = producto.stock + delta;
        if (nuevoStock < 0) {
            mostrarNotificacion('Error', 'El stock no puede ser negativo', 'error');
            return;
        }

        // Actualizar el stock en el servidor
        await fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stock: nuevoStock })
        });

        await cargadeproducto(); // Recargar la tabla
        mostrarNotificacion('Éxito', 'Stock actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error al ajustar el stock:', error);
        mostrarNotificacion('Error', 'No se pudo actualizar el stock', 'error');
    }
}