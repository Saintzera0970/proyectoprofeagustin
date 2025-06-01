import  {Cliente}  from '../../conection.js';

export const newCliente = async (nombre, email, telefono) => {
  try {
    const nuevocliente = await Cliente.create({ 
      nombre, 
      email, 
      telefono,
      status: true 
    });
    return nuevocliente;
  } catch (error) {
    throw new Error(`Error creando cliente: ${error.message}`);
  }
};
