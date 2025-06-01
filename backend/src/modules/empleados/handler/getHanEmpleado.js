import { getAllEmpleados } from '../controller/getEmpleado.js';


export const getAllEmpleadosHandler = async (req, res) => {
  try {
    const empleados = await getAllEmpleados();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



