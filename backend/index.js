import express from 'express';
import { conn } from './src/conection.js';
import  {ruta}  from './src/clientes/rutas/indexRoutes.js';

const server = express();

server.use(express.json());
server.use('/', ruta); // 👈 Usar las rutas


conn.sync({ force: false }).then(() => {
  server.listen(3001, () => {
    console.log('estoy listo :P');
  });
}).catch(err => {
  console.error('Error en conexión con DB:', err);
});