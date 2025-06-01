import { getClientByName } from '../controller/getClientByName.js';



export const getClientByNameHandler = async (req, res) => {
  const { nombre } = req.params;
  try {
    const cliente = await getClientByName(nombre);
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};