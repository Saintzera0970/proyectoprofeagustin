// Inicializar los iconos de Lucide
lucide.createIcons();

function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    document.getElementById('datetime').textContent = `${date} - ${time}`;
}

function toggleNewProduct() {
    const form = document.getElementById('newProductForm');
    form.classList.toggle('hidden');
}

function filterProducts(query) {
    // Implementar filtrado de productos
    console.log('Filtrando productos:', query);
}

function adjustStock(productId) {
    // Implementar ajuste de stock
    console.log('Ajustando stock del producto:', productId);
}

function editProduct(productId) {
    
    console.log('Editando producto:', productId);
}

function deleteProduct(productId) {
    // Implementar eliminación de producto
    console.log('Eliminando producto:', productId);
}

// Actualizar fecha y hora cada segundo
setInterval(updateDateTime, 1000);
updateDateTime(); 


async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:1000/productos');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const products = await response.json();
        return(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
async function cargadeproducto(){
    const productos = await fetchProducts();
    for (const element of productos) {
        const productRow = document.createElement('tr');
        productRow.innerHTML = `
                    <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm font-medium text-gray-900">
                            ${element.name}
                        </div>
                        <div class="text-sm text-gray-500">
                            descripción del producto
                        </div>
                        </div>
                    </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${element.category}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <span class="text-sm text-gray-900">${element.stock}</span>
                        <button class="ml-2 text-primary hover:text-primary-dark" onclick="adjustStock(1)">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        </button>
                    </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${element.price}    
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-${element.stock < 5 ? 'red-600' : 'green-800'}">
                        ${element.stock < 5 ? 'Stock bajo' : 'En stock'}
                    </span>
                    </td>                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mx-1" onclick="editProduct(${element.id})">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 mx-1" onclick="deleteProduct(${element.id})">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                    </td>`;        
        const tabla = document.getElementById('productsTableBody')
        if (tabla) {
            tabla.appendChild(productRow);
        }
    }
    // Actualizar los iconos después de agregar todas las filas
    lucide.createIcons();
}

cargadeproducto();