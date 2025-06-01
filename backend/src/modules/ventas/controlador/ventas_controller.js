import {ventas, productos, detalles} from '../../../conection.js'


export async function GetAllOrders() {
    try {
        return await ventas.findAll()
    } catch (error) {
        throw error
    }
}

export async function CreateOrder(order){
    const totalAmount = 0
    try {
       // return await ventas.create(order)
        const productList = await productos.findAll({ where: { id: productId.map((e) => e.id) } });
        for (const element of order.productId) {
            const product = productList.find((product) => product.id === element.id);
            if (product) {
                //const wholePrice = product.wholPrice ? product.wholPrice : product.price;
                //const precio = wholSale ? wholePrice : product.price;
                totalAmount += element.quantity * element.precio;
            }
        }
        const ventaCreada = await ventas.create(order);

        for (const element of order.productId) {
            const product = productList.find((product) => product.id === element.id);
            if (product) {
                const precio = wholSale ? product.wholPrice ?? product.price : product.price;

                if (product.stock >= element.quantity) {
                    await detalles.create({
                        orderId: response.id,
                        productId: product.id,
                        quantity: element.quantity,
                        unitPrice: precio,
                        totalPrice: element.quantity * precio
                    });

                    await products.update(
                        { stock: product.stock - element.quantity },
                        { where: { id: product.id } }
                    );
                } else {
                    return res.status(400).json({ error: `Not enough stock for product ID: ${product.id}` });
                }
            }
        }

        const fullResponse = await orders.findOne({
            where: { id: response.id },
            include: [{
                model: itemorder,
                include: [products]
            }]
        });
    } catch (error) {
        throw error
    }
}
    