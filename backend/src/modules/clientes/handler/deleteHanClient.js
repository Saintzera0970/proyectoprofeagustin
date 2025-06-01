import { deleteCliente } from '../controller/deleteClient.js'



export const deleteClientHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'Falta el id del cliente' });
    }
    const result = await deleteCliente(id);
      res.status(200).json({ message: 'Usuario eliminado', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};