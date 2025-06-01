import { getEmpleadoByName } from '../controller/getEmpleadoByName.js';



export const getEmpleadoByNameHandler = async (req, res) => {
  const { nombre } = req.params;
  try {
    const empleado = await getEmpleadoByName(nombre);
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};