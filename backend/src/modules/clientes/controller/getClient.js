import  {Cliente}  from '../../../conection.js'; // Ajusta la ruta


export const getAllClients = async () => {
  const clientes = await Cliente.findAll({
    where: { status: true }
  });
  return clientes;
};