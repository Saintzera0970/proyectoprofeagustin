import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import empleadoModel from './empleados/modeloEmpleado/modeloEmpleado.js';
import clienteModel from './clientes/modeloClient/modeloCliente.js';

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});

// Cargar modelos
empleadoModel(sequelize);
clienteModel(sequelize);

// Exportar modelos y conexión
export const { Empleado, Cliente } = sequelize.models;
export const conn = sequelize;
















// import dotenv from'dotenv';
// import{ Sequelize } from  'sequelize';

// dotenv.config();
// const {
//   DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_URL
// } = process.env;



// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: 'postgres'
// });


// const { } = sequelize.models;


// export default {
//   ...sequelize.models,
//   conn: sequelize,
// };
