import {Empleado} from '../conection.js'
export const empleadosMock = [
  {
    nombre: "Ana Torres",
    telefono: "3811111111",
    pw:"12346",
    rol: "cajera"
  },
  {
    nombre: "Pedro Díaz",
    telefono: "3812222222",
    pw:"12346",
    rol: "supervisor"
  },
  {
    nombre: "Laura Méndez",
    telefono: "3813333333",
    pw:"jefe",
    rol: "jefe"
  },
  {
    nombre: "Martín Acuña",
    telefono: "3814444444",
    pw:"12346",
    rol: "repositor"
  },
  {
    nombre: "Carla Ríos",
    telefono: "3815555555",
    pw:"12346",
    rol: "administrativa"
  }
];

export async function UploadEmployees() {
    const response = empleadosMock.map(async(element)=>{
       return await Empleado.create({
        nombre:element.nombre,
        telefono:element.telefono,
        pw:element.pw,
        rol:element.rol
       })
    })
    return response;
};
