import  {Cliente}  from '../../../conection.js'; // Ajusta la ruta


export const getAllClients = async () => {
  const clientes = await Cliente.findAll();
  return clientes;
};