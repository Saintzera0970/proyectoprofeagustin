import  {Cliente}  from '../../../conection.js';

export const newCliente = async (nombre, dni, telefono, direccion) => {
  try {
    const nuevocliente = await Cliente.create({ 
      nombre: nombre.toLowerCase(),
      dni,
      telefono,
      direccion,
      status: true 
    });
    return nuevocliente;
  } catch (error) {
    throw new Error(`Error creando cliente: ${error.message}`);
  }
};
   