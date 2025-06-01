import dotenv from'dotenv';
import{ Sequelize } from  'sequelize';
import ventasModel from './ventas/modelo/modelo.js'
import { modeloProducto, DetailModel } from './productos/modelo/modelo.js';
dotenv.config();
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_URL
} = process.env;



const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false
});

//aqui se inicializan los modelos en la base de datos 
ventasModel(sequelize)
modeloProducto(sequelize)
DetailModel(sequelize)
const { productos , ventas, detalles} = sequelize.models;

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
export default {
  ...sequelize.models,
  conn: sequelize,
};
