import express from 'express';
import conn from "./src/conection.js"
import { router } from './src/router.js';

const server = express()

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
conn.conn.sync({force:true}).then(()=>{
    server.listen(1000, () => {
         console.log('Server run in url : http://localhost:1000/');
       });
})