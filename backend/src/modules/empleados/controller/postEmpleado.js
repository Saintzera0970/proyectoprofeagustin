import  {Empleado}  from '../../../conection.js';

export const newEmpleado = async (nombre, telefono, rol, pw) => {
  try {
    const nuevoEmpleado = await Empleado.create({ 
      nombre: nombre.toLowerCase(),
      telefono,
      rol,
      pw,
      status: true 
    });
    return nuevoEmpleado;
  } catch (error) {
    throw new Error(`Error creando empleado: ${error.message}`);
  }
};
   