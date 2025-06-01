import { GetAllOrders,CreateOrder } from "../controlador/ventas_controller.js"

export async function GetAllOrdersHandler() {
    try {
        return await GetAllOrders()
    } catch (error) {
        throw error
    }
}

export async function CreateVentaHandler(order) {
    try {
        return await CreateOrder(order)
    } catch (error) {
        throw error
    }
}