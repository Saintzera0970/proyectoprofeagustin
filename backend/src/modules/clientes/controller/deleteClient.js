import { Cliente } from '../../../conection.js'; // Asegurate de que la ruta sea correcta

export const deleteCliente = async (id) => {
  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    // Eliminación lógica: desactivar el cliente
    cliente.status = false;
    await cliente.save();

    return { id, message: 'Cliente desactivado correctamente' };
  } catch (error) {
    throw new Error('Error al desactivar el cliente: ' + error.message);
  }
};