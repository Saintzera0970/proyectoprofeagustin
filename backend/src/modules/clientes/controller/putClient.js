import  {Cliente}  from '../../../conection.js'; // Asegurate de que esta ruta sea la correcta

export const updateCliente = async (id, nombre, email, telefono) => {
  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    cliente.nombre = nombre;
    cliente.email = email;
    cliente.telefono = telefono;

    await cliente.save();

    return cliente;
  } catch (error) {
    throw new Error(`Error al actualizar el cliente: ${error.message}`);
  }
};