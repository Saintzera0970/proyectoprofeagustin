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