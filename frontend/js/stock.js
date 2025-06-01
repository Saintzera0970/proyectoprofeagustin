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

function filterProducts(query) {
    // Implementar filtrado de productos
    console.log('Filtrando productos:', query);
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

async function cargadeproducto() {
    const productosTableBody = document.getElementById('productsTableBody');
    productosTableBody.innerHTML = ''; // Limpiar la tabla antes de cargar

    const productos = await fetchProducts();
    for (const element of productos) {
        const productRow = document.createElement('tr');
        productRow.setAttribute('data-product-id', element.id);
        productRow.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div>
                        <div class="text-sm font-medium text-gray-900">
                            ${element.name}
                        </div>
                        <div class="text-sm text-gray-500">
                            ${element.description || 'Sin descripción'}
                        </div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${element.category}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <button class="mr-2 text-primary hover:text-primary-dark" onclick="adjustStock(${element.id}, -1)">
                        <i data-lucide="minus-circle" class="w-4 h-4"></i>
                    </button>
                    <span class="text-sm text-gray-900">${element.stock}</span>
                    <button class="ml-2 text-primary hover:text-primary-dark" onclick="adjustStock(${element.id}, 1)">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                $${element.price}    
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold ${element.stock < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${element.stock < 5 ? 'Stock bajo' : 'En stock'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mx-1" onclick="editProduct(${element.id})">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 mx-1" onclick="deleteProduct(${element.id})">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>`;
        
        productosTableBody.appendChild(productRow);
    }
    lucide.createIcons();
}

cargadeproducto();