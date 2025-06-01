import { updateEmpleado } from '../controller/putEmpleado.js'


export const putEmpleadotHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, telefono, rol } = req.body;
  
      if (!id || !nombre || !telefono || !rol ) {
        return res.status(400).json({ message: 'Faltan datos' });
      }
  
      const result = await updateEmpleado(id, nombre, telefono, rol);
  
      res.status(200).json({ message: 'Usuario actualizado', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};