import {ventas} from "../conection.js";
import { ordersArray} from './ventasEjemplo.js'

export async function UploadOrders() {
    const response = ordersArray.map(async(element)=>{
        return await ventas.create({
         status:element.status,
         clientName:element.clientName,
         //employeeId:element.employeeId,
         wholSale:element.wholSale,
         createdAt:element.createdAt,
         delivery:element.delivery,
         payMethod:element.payMethod,
         //productId:element.productId,
         totalAmount:100
        })
     })
     return response;
}