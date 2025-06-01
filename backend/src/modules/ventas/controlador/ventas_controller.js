import {ventas, productos, detalles} from '../../../conection.js'


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
        const productList = await productos.findAll({ where: { id: order.productId.map((e) => e.id) } });
        for (const element of order.productId) {
            const product = productList.find((product) => product.id === element.id);
            if (product) {
                totalAmount += element.quantity * product.price;
            }
        }
        console.log("totalamount:" +totalAmount);
        
        const ventaCreada = await ventas.create({clientName: order.clientName,               payMethod:order.payMethod, 
            delivery: order.delivery,
            description:order.description , totalAmount:totalAmount
        });


        for (const element of order.productId) {
            const product = productList.find((product) => product.id === element.id);
            if (product) {
                if (product.stock >= element.quantity) {
                    console.log(product.id);
                    
                    await detalles.create({
                        ventaId: ventaCreada.id,
                        productoId: product.id,
                        quantity: element.quantity,
                        unitPrice: product.price,
                        totalPrice: element.quantity * product.price
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
            include: [{
                model: detalles,
                include: [{model:productos}]
            }]
        });
        return fullResponse
    } catch (error) {
        throw error
    }
}
    