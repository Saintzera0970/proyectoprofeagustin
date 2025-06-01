import { deleteEmpleado } from '../controller/deleteEmpleado.js';



export const deleteEmpleadoHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'Falta el id del cliente' });
    }
    const result = await deleteEmpleado(id);
      res.status(200).json({ message: 'Usuario eliminado', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};