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
            normalizeText(producto.brand),
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
                            ${producto.description ? (producto.description.length > 50 ? producto.description.substring(0, 50) + '...' : producto.description) : 'Sin descripción'}
                        </div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${producto.brand || 'Sin marca'}
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

// Función para ajustar el stock en el modal
function adjustModalStock(delta) {
    const input = document.getElementById('editStock');
    const newValue = Math.max(0, parseInt(input.value || 0) + delta);
    input.value = newValue;
    // Prevenir la propagación del evento
    event.stopPropagation();
}

// Función para abrir el modal de edición
async function editProduct(productId) {
    try {
        const response = await fetch(`https://back-prof-agustin-2.onrender.com/productos/${productId}`);
        if (!response.ok) throw new Error('Error al obtener el producto');
        
        const producto = await response.json();
        editingProductId = productId;

        // Llenar el modal con los datos del producto
        document.getElementById('editBrand').value = producto.brand;
        document.getElementById('editName').value = producto.name;
        document.getElementById('editStock').value = producto.stock;
        document.getElementById('editPrice').value = producto.price;
        document.getElementById('editDescription').value = producto.description || '';

        // Mostrar el modal con animación
        const modal = document.getElementById('editModal');
        const modalContent = document.getElementById('modalContent');
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Forzar un reflow para que la animación funcione
        void modal.offsetWidth;
        
        modalContent.classList.add('scale-100', 'opacity-100');
        modalContent.classList.remove('scale-95', 'opacity-0');

        // Agregar event listener para cerrar con Escape
        document.addEventListener('keydown', handleEscapeKey);
        
        // Agregar event listener para cerrar al hacer clic fuera
        modal.addEventListener('click', handleOutsideClick);

        // Prevenir que los clics dentro del modal lo cierren
        modalContent.addEventListener('click', (e) => e.stopPropagation());

        lucide.createIcons();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', 'No se pudo cargar el producto');
    }
}

// Función para manejar la tecla Escape
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        cerrarModal();
    }
}

// Función para manejar clic fuera del modal
function handleOutsideClick(e) {
    const modalContent = document.getElementById('modalContent');
    if (e.target.id === 'editModal') {
        cerrarModal();
    }
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('editModal');
    const modalContent = document.getElementById('modalContent');
    
    // Iniciar animación de salida
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        // Remover event listeners
        document.removeEventListener('keydown', handleEscapeKey);
        modal.removeEventListener('click', handleOutsideClick);
    }, 300);

    editingProductId = null;
}

// Función para guardar los cambios
async function guardarCambios() {
    try {
        // Obtener y validar los datos
        const brand = document.getElementById('editBrand').value.trim();
        const name = document.getElementById('editName').value.trim();
        const stock = parseInt(document.getElementById('editStock').value) || 0;
        const price = parseFloat(document.getElementById('editPrice').value) || 0;
        const description = document.getElementById('editDescription').value.trim();

        // Validar datos requeridos
        if (!brand || !name || price <= 0) {
            throw new Error('Por favor complete todos los campos requeridos');
        }

        const productoData = {
            brand,
            name,
            stock: Math.max(0, stock), // Asegurar que el stock no sea negativo
            price: Number(price.toFixed(2)), // Formatear precio a 2 decimales
            description: description || null // Si está vacío, enviar null
        };

        const response = await fetch(`https://back-prof-agustin-2.onrender.com/productos/${editingProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar el producto');
        }

        mostrarNotificacion('Éxito', 'Producto actualizado correctamente');
        cerrarModal();
        await cargadeproducto();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', error.message || 'No se pudo actualizar el producto', 'error');
    }
}

// Función para ajustar el stock directamente desde la tabla
async function adjustStock(productId, delta) {
    try {
        const response = await fetch(`https://back-prof-agustin-2.onrender.com/productos/${productId}`);
        if (!response.ok) throw new Error('Error al obtener el producto');
        
        const producto = await response.json();
        const nuevoStock = Math.max(0, producto.stock + delta);

        const updateResponse = await fetch(`https://back-prof-agustin-2.onrender.com/productos/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...producto,
                stock: nuevoStock
            })
        });

        if (!updateResponse.ok) throw new Error('Error al actualizar el stock');

        mostrarNotificacion('Éxito', 'Stock actualizado correctamente');
        await cargadeproducto();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', 'No se pudo actualizar el stock');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 animate-fade-in`;
    notificacion.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-10 h-10 ${tipo === 'success' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center">
                <i data-lucide="${tipo === 'success' ? 'check' : 'x'}" class="w-6 h-6 ${tipo === 'success' ? 'text-green-600' : 'text-red-600'}"></i>
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

async function deleteProduct(productId) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
        return;
    }

    try {
        const response = await fetch(`https://back-prof-agustin-2.onrender.com/productos/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
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
    
    // Obtener los valores del formulario
    const marca = form.querySelector('input[placeholder="Marca"]').value;
    const nombre = form.querySelector('input[placeholder="Nombre del producto"]').value;
    const precio = parseFloat(form.querySelector('input[type="number"][step="0.01"]').value);
    const stock = parseInt(form.querySelector('input[type="number"]:not([step])').value);
    const descripcion = form.querySelector('textarea').value;

    const productoData = {
        brand: marca,
        name: nombre,
        price: precio,
        stock: stock,
        description: descripcion || null // Si no hay descripción, enviar null
    };

    try {
        const response = await fetch('https://back-prof-agustin-2.onrender.com/productos', {
            method: 'POST',
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
            'Producto guardado correctamente',
            'success'
        );

        toggleNewProduct();
        await cargadeproducto(); // Recargar la tabla
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error', 'Error al guardar el producto', 'error');
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Eliminar datos del empleado del localStorage
    localStorage.removeItem('empleadoData');
    
    // Redirigir al index
    window.location.href = '/frontend/html/index.html';
}