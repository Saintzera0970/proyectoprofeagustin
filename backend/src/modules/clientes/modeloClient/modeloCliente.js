import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Cliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
      this.setDataValue('nombre', value.toLowerCase());
  }
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
    }
  }, {
    tableName: 'clientes',
    timestamps: false,
  });
}; 