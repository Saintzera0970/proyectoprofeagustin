import { newCliente } from '../controller/postClient.js'

export const postHanClient = async (req, res) => {
    try {
      const { nombre, dni, telefono, direccion } = req.body;
  
      if (!nombre || !dni) {
        return res.status(400).json({ message: 'El nombre y DNI son campos obligatorios' });
      }
      const result = await newCliente(nombre, dni, telefono, direccion);
      console.log(result);
      
      res.status(201).json({message: 'Cliente creado exitosamente', result});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};