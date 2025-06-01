import { newEmpleado } from '../controller/postEmpleado.js'



export const postHanEmpleado = async (req, res) => {
    try {
      const { nombre, telefono, rol } = req.body;
  
      if (!nombre || !telefono || !rol ) {
        return res.status(400).json({ message: 'Faltan datos' });
      }
      const result = await newEmpleado(nombre, telefono, rol );
      console.log(result);
      
        res.status(201).json({message: 'user creado', result});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};