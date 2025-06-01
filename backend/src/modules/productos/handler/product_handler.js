import { CreateProductController, DeleteProductController, GetAllProductsController, GetProductByIdController, PutProductController } from '../../controler/product_controller.js';

export async function GetAllProductHandler() {
    try {
       return await GetAllProductsController()
    } catch (error) {
        throw error
    }
} 

export async function GetByIdProductHandler(id){
    try {
        return await GetProductByIdController(id)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

export async function CreateProductHandler(product) {
    try {
        return await CreateProductController(product)
    } catch (error) {
        throw error
    }
}

export async function PutProductHandler (id,productoInfo) {
    try {
        return await PutProductController(id,productoInfo)
    } catch (error) {
        throw error
    }
}

export async function DeleteProductHandler(id) {
    try {
        return await DeleteProductController(id)
    } catch (error) {
        throw error
    }
}


