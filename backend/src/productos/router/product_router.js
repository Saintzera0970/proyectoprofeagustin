import express from 'express';
import db from '../../conection.js';
import { CreateProductHandler, DeleteProductHandler, GetAllProductHandler, GetByIdProductHandler, PutProductHandler } from '../handler/product_handler.js';

export const productsHandler = express.Router();

productsHandler.get('/',async(req,res)=>{
    try {
         const response = await GetAllProductHandler()
         res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});
productsHandler.get('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
       const response = await GetByIdProductHandler(id)
       res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
});

productsHandler.post('/',async(req,res)=>{
    try {
        const response = await CreateProductHandler(req.body)
        res.status(201).json(response)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
});

productsHandler.put('/:id',async (req,res)=>{
    const {id}= req.params;
    try {
        const response =  await PutProductHandler(id,req.body)
        res.status(201).json(response)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
});

productsHandler.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
       const response = await DeleteProductHandler(id)
       res.status(204).send(response)
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});
