import { newEmpleado } from '../controller/postEmpleado.js'

export const postHanEmpleado = async (req, res) => {
    try {
      const { nombre, telefono, rol, password } = req.body;
  
      if (!nombre || !telefono || !rol || !password) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
      }
      const result = await newEmpleado(nombre, telefono, rol, password);
      console.log(result);
      
      res.status(201).json({message: 'Empleado creado exitosamente', result});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};