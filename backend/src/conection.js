import dotenv from'dotenv';
import{ Sequelize } from  'sequelize';
import ventasModel from './ventas/modelo/modelo.js'
import productosModel from './productos/modelo/modelo.js'

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
productosModel(sequelize)

const { productos , ventas} = sequelize.models;


export default {
  ...sequelize.models,
  conn: sequelize,
};
