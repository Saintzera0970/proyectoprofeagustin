import  {Empleado}  from '../../../conection.js'; // Ajusta la ruta


export const getAllEmpleados = async () => {
  const empleados = await Empleado.findAll({
    where: { status: true }
  });
  return empleados;
};