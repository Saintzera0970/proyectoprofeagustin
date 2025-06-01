async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:1000/productos');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const products = await response.json();
        
        // Procesar y validar los datos
        return products.map(product => ({
            ...product,
            price: parseFloat(product.price || 0),
            stock: parseInt(product.stock || 0),
            name: product.name || '',
            category: product.category || '',
            description: product.description || '',
            id: product.id || ''
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Retornar array vacío en caso de error
    }
}