import dotenv from'dotenv';
import{ Sequelize } from  'sequelize';
import ventasModel from './modules/ventas/modelo/modelo.js'
import { modeloProducto, DetailModel } from './modules/productos/modelo/modelo.js';
import clienteModel from './modules/clientes/modeloClient/modeloCliente.js';
import empleadoModel from './modules/empleados/modeloEmpleado/modeloEmpleado.js'
dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false
});


ventasModel(sequelize)
modeloProducto(sequelize)
DetailModel(sequelize)
clienteModel(sequelize);
empleadoModel(sequelize);

export const { Empleado, Cliente, productos , ventas, detalles } = sequelize.models;

ventas.hasMany(detalles,{
  foreignKey:'ventaId',
  sourceKey:'id'
});
detalles.belongsTo(ventas,{
  foreignKey:'ventaId',
  targetKey:'id'
});
productos.hasMany(detalles,{
  foreignKey:'productoId',
  sourceKey:'id'
});
detalles.belongsTo(productos,{
  foreignKey:'productoId',
  targetKey:'id'
});




Cliente.hasMany(ventas, {
  foreignKey: 'clienteId',
  sourceKey: 'id'
});
ventas.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  targetKey: 'id'
});


// Empleado - Ventas (1:N)
Empleado.hasMany(ventas, {
  foreignKey: 'empleadoId',
  sourceKey: 'id'
});
ventas.belongsTo(Empleado, {
  foreignKey: 'empleadoId',
  targetKey: 'id'
});

export const conn = sequelize;
