import express from 'express';
import { router } from './src/router.js';
import { UploadOrders } from './src/utils/uploadVentas.js';
import { UploadProducts } from './src/utils/upload_productos.js';
import { conn } from './src/conection.js';
import { UploadEmployees } from './src/utils/EmpleadosEjemplo.js';
import { UploadClients } from './src/utils/ClientesEjemplo.js';
const server = express();

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
server.use(express.json())
server.use(express.urlencoded({ extended: true }));

server.use('/',router)
conn.sync({force:true}).then(()=>{
    server.listen(1000, () => {
      UploadClients()
      UploadEmployees()
      // UploadOrders()
      // UploadProducts()
         console.log('Server run in url : http://localhost:1000/');
       });
})
