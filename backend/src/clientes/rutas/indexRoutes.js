import { Router } from 'express';
//import { getClientsHandler } from '../handler/getHanClinetByName'
import {postHanClient} from '../handler/postHanClient.js';
import {putClientHandler} from '../handler/putHanClient.js';
import {deleteClientHandler} from '../handler/deleteHanClient.js';


export const ruta = Router();

//ruta.get('/', getClientsHandler)
//ruta.get('/buscar/name', )
ruta.post('/postClient', postHanClient)
ruta.put('/updateClient/:id', putClientHandler)
ruta.delete('/deleteClient/:id', deleteClientHandler)