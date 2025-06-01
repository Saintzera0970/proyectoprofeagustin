import db from '../../conection.js'

const {ventas} = db;
export async function GetAllOrders() {
    try {
        return await ventas.findAll()
    } catch (error) {
        throw error
    }
}

export async function CreateOrder(order){
    try {
        return await ventas.create(order)
    } catch (error) {
        throw error
    }
}
    
// export async function (params) {
    
// }