import express from 'express';
import db from '../../conection.js';
import { GetAllOrdersHandler, CreateVentaHandler } from '../handler/Handler_ventas.js';


const {ventas} = db;

export const VentasRouter = express.Router();


VentasRouter.get('/',async(req,res)=>{
   try {
    const response = await GetAllOrdersHandler()
    return res.status(200).send(response)
   } catch (error) {
        res.status(500).json({error})
   }
});
VentasRouter.get('/:id',async(req,res)=>{
   
});

VentasRouter.post('/',async(req,res)=>{
    try {
        const response = await CreateVentaHandler(req.body)
        res.status(201).send(response)
    } catch (error) {
        res.status(500).json({error})
    }
});

VentasRouter.put('/:id',async (req,res)=>{
   
});

VentasRouter.delete('/:id',async(req,res)=>{
    
});
