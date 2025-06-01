import { getAllClients } from '../controller/getClient.js';


export const getAllClientsHandler = async (req, res) => {
  try {
    const clientes = await getAllClients();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



