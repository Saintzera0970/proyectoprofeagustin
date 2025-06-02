import {ventas, productos, detalles,Cliente,Empleado} from '../../../conection.js'


export async function GetAllOrders() {
    try {
        return await ventas.findAll()
    } catch (error) {
        throw error
    }
}

export async function CreateOrder(order){
    let totalAmount = 0
    try {
        const productId = order.productId.map((e) => parseInt(e.id));
        const productList = await productos.findAll({
            where: { id: productId },
        });
        
        const ventaCreada = await ventas.create({
            payMethod:order.payMethod, 
            delivery: order.delivery,
            description:order.description , 
            totalAmount: 0,
            clienteId: order.clienteId ? parseInt(order.clienteId) : null, 
            empleadoId: parseInt(order.empleadoId)
        });


        for (const element of order.productId) {
            const product = productList.find((product) => product.id === element.id);
            if (product) {
                if (product.stock >= element.quantity) {
                    const unitPrice = parseInt(product.price);
                    const totalPrice = unitPrice * element.quantity;
                    totalAmount += totalPrice;
                    console.log(product.id);
                    
                    await detalles.create({
                        ventaId: ventaCreada.id,
                        productoId: product.id,
                        quantity: element.quantity,
                        unitPrice: unitPrice,
                        totalPrice: totalPrice
                    });

                    await productos.update(
                        { stock: product.stock - element.quantity },
                        { where: { id: product.id } }
                    );
                } else {
                    throw new Error('Error, stock bajo');
                }
            }
        }

        const fullResponse = await ventas.findOne({
            where: { id: ventaCreada.id },
            attributes: { exclude: ['clienteId', 'empleadoId'] },
            include: [
                {
                model: detalles,
                include: [{ model: productos }]
                },
                {
                model: Cliente
                },
                {
                model: Empleado
                }
            ]
});

        return fullResponse
    } catch (error) {
        throw error
    }
}
    