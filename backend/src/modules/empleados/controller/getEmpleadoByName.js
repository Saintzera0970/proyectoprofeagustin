import  {Empleado}  from '../../../conection.js';



export const getEmpleadoByName = async (nombre) => {
  // Busca clientes cuyo nombre coincida parcialmente (case insensitive)
  const empleado = await Empleado.findOne({
    where: { nombre }
  });
  console.log(empleado);
  
  return empleado;
};


// 1 clientes hace muchas ventas una pertenece a un silo cliente 
// 1 empleado puede hacer muchas ventas y una venmta solo puede ser a un empleado