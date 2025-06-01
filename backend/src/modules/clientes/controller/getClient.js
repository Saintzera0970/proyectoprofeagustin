import { Cliente } from '../../conection.js'; // Ajusta la ruta

export const getClientByName = async (nombre) => {
  // Busca clientes cuyo nombre coincida parcialmente (case insensitive)
  const cliente = await Cliente.findAll({
    where: {
      nombre: {
        [Op.iLike]: `%${nombre}%`  // Para Postgres y búsqueda case insensitive
      }
    }
  });
  return cliente;
};

export const getAllClients = async () => {
  const clientes = await Cliente.findAll({
    where: { status: true }
  });
  return clientes;
};