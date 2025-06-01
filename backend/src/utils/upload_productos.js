import db from  "../conection.js";
import { api} from "./productosEjemplo.js";

const {productos} = db;

export async function UploadProducts() {
    const response = api.map(async(element)=>{
       return await productos.create({
        brand:element.brand,
        name:element.name,
        category:element.category,
        price:element.price,
        stock:element.stock,
        wholPrice:element.wholPrice,
        codeBar:element.codeBar
       })
    })
    return response;
};
