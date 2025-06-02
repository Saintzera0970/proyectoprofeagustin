import { Cliente } from "../conection.js";
export const clientesMock = [
  {
    nombre: "Facundo Cortez",
    dni: "30123456",
    telefono: "3814567890",
    tipo: "mayorista"
  },
  {
    nombre: "Lucía Gómez",
    dni: "31234567",
    telefono: "3815678901",
    tipo: "minorista"
  },
  {
    nombre: "Carlos Pérez",
    dni: "32345678",
    telefono: "3816789012",
    tipo: "mayorista"
  },
  {
    nombre: "María López",
    dni: "33456789",
    telefono: "3817890123",
    tipo: "minorista"
  },
  {
    nombre: "Javier Morales",
    dni: "34567890",
    telefono: "3818901234",
    tipo: "mayorista"
  }
];

export async function UploadClients() {
    const response = clientesMock.map(async(element)=>{
       return await Cliente.create({
        nombre:element.nombre,
        telefono:element.telefono,
        dni:element.dni,
        tipo:element.tipo
       })
    })
    return response;
};