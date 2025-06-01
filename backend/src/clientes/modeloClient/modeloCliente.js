import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Cliente', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
    }
  }, {
    tableName: 'clientes',
    timestamps: false,
  });
}; 