import  {Cliente}  from '../../../conection.js';



export const getClientByName = async (nombre) => {
  // Busca clientes cuyo nombre coincida parcialmente (case insensitive)
  const cliente = await Cliente.findOne({
    where: { nombre }
  });
  return cliente;
};