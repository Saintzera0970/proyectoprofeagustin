import { newCliente } from '../controller/postClient.js'



export const postHanClient = async (req, res) => {
    try {
      const { nombre, email, telefono } = req.body;
  
      if (!nombre || !email || !telefono) {
        return res.status(400).json({ message: 'Faltan datos' });
      }
      const result = await newCliente(nombre, email, telefono);
      console.log(result);
      
        res.status(201).json({message: 'user creado', result});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};