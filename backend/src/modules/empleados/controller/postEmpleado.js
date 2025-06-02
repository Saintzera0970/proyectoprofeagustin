import  {Empleado}  from '../../../conection.js';

export const newEmpleado = async (nombre, telefono, rol) => {
  try {
    const nuevoEmpleado = await Empleado.create({ 
      nombre:nombre.toLowerCase(),
      telefono,
      rol,
      status: true 
    });
    return nuevoEmpleado;
  } catch (error) {
    throw new Error(`Error creando cliente: ${error.message}`);
  }
};
   