export function InitUserModel(seq) {
  seq.define(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone:{
        type: DataTypes.STRING,
  
      },
      passwordResetToken:{
        type: DataTypes.STRING
      },
      passwordResetTokenExpiry:{
        type: DataTypes.DATE
      }
    },
    {
      sequelize:seq, 
      modelName: 'user', 
      tableName: 'users', 
      timestamps: true, 
    }
  );
  
}
