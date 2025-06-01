export const getClientsHandler = async (req, res) => {
    const { nombre } = req.query;
    try {
      if (nombre) {
        const cliente = await getClientByName(nombre);
        res.status(200).json(cliente);
      } else {
        const clientes = await getAllClients();
        res.status(200).json(clientes);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };