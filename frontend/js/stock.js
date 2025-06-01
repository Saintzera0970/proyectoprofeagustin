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
    // Implementar edición de producto
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
        console.log(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}   

fetchProducts()
