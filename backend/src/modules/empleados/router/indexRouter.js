import { Router } from 'express';


import { getAllEmpleadosHandler } from '../handler/getHanEmpleado.js';
import { getEmpleadoByNameHandler } from '../handler/getHanEmpleadoByName.js'; 
import { postHanEmpleado } from '../handler/postHanEmpleado.js';
import { putEmpleadotHandler } from '../handler/putHanEmpleado.js';
import { deleteEmpleadoHandler } from '../handler/deleteHanEmpleado.js';


export const rutaEmpleado = Router();

rutaEmpleado.get('/', getAllEmpleadosHandler)
rutaEmpleado.get('/buscar/:nombre', getEmpleadoByNameHandler)
rutaEmpleado.post('/postEmpleado', postHanEmpleado)
rutaEmpleado.put('/updateEmpleado/:id', putEmpleadotHandler)
rutaEmpleado.delete('/deleteEmpleado/:id', deleteEmpleadoHandler)