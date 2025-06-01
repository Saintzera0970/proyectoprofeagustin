import { updateCliente } from '../controller/putClient.js'


export const putClientHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, email, telefono } = req.body;
  
      if (!id || !nombre || !email || !telefono) {
        return res.status(400).json({ message: 'Faltan datos' });
      }
  
      const result = await updateCliente(id, nombre, email, telefono);
  
      res.status(200).json({ message: 'Usuario actualizado', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};