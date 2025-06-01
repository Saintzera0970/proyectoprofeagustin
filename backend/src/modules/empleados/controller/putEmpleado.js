import  {Empleado}  from '../../../conection.js'; // Asegurate de que esta ruta sea la correcta

export const updateEmpleado = async (id, nombre, email, telefono) => {
  try {
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      throw new Error('Cliente no encontrado');
    }

    empleado.nombre = nombre;
    empleado.email = email;
    empleado.telefono = telefono;

    await empleado.save();

    return empleado;
  } catch (error) {
    throw new Error(`Error al actualizar el cliente: ${error.message}`);
  }
};