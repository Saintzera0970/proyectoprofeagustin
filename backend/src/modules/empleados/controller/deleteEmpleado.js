import  {Empleado}  from '../../../conection.js'; // Asegurate de que la ruta sea correcta

export const deleteEmpleado = async (id) => {
  try {
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      throw new Error('Cliente no encontrado');
    }

    // Eliminación lógica: desactivar el cliente
    empleado.status = false;
    await empleado.save();

    return { id, message: 'Cliente desactivado correctamente' };
  } catch (error) {
    throw new Error('Error al desactivar el cliente: ' + error.message);
  }
};