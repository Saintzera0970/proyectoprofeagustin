import { Router } from 'express';


import { getAllClientsHandler } from '../handler/getHanClient.js';
import { getClientByNameHandler } from '../handler/getHanClientByName.js'; 
import {postHanClient} from '../handler/postHanClient.js';
import {putClientHandler} from '../handler/putHanClient.js';
import {deleteClientHandler} from '../handler/deleteHanClient.js';


export const ruta = Router();

ruta.get('/', getAllClientsHandler)
ruta.get('/buscar/:nombre', getClientByNameHandler)
ruta.post('/postClient', postHanClient)
ruta.put('/updateClient/:id', putClientHandler)
ruta.delete('/deleteClient/:id', deleteClientHandler)