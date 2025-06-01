import dotenv from'dotenv';
import{ Sequelize } from  'sequelize';
import ventasModel from './modules/ventas/modelo/modelo.js'
import { modeloProducto, DetailModel } from './modules/productos/modelo/modelo.js';
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

export const { Empleado, Cliente, productos , ventas, detalles } = sequelize.models;

ventas.hasMany(detalles,{
  foreignKey:'ventaId',
  sourceKey:'id'
});
detalles.belongsTo(ventas,{
  foreignKey:'ventaId',
  tergetKey:'id'
});
productos.hasMany(detalles,{
  foreignKey:'productoId',
  sourceKey:'id'
});
detalles.belongsTo(productos,{
  foreignKey:'productoId',
  targetKey:'id'
});

export const conn = sequelize;
