import {productos} from '../../../conection.js'

export async function CreateProductController(productoInfo) {
    try {
        return await productos.create(productoInfo)
    } catch (error) {
        throw error
    }
}

export async function GetProductByIdController(id) {
    try {
        return await productos.findOne({where:{id}});
    } catch (error) {
        throw error
    }
}

export async function GetAllProductsController() {
    try {
        const response = await productos.findAll()
        return response.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        
    } catch (error) {
        throw error
    }
}

export async function PutProductController(id,productoInfo) {
    try {
        const product = await productos.findOne({where:{id}})
        if (!product) {
             throw new Error('El producto con ese ID no existe');
        }
        return await product.update(productoInfo)
    } catch (error) {
        throw error
    }
}

export async function DeleteProductController(id) {
    try {
        const product = await productos.findOne({where:{id}})
        if (!product) {
             throw new Error('El producto con ese ID no existe');
        }
        return await product.destroy()
    } catch (error) {
        throw error
    }
}