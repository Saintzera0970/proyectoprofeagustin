import { DataTypes } from  "sequelize";

export default (sequelize)=>{
    return sequelize.define("productos",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        brand:{
            type:DataTypes.STRING,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        category: {
            type: DataTypes.STRING,
            allowNull:false
        },
        price:{
         type:DataTypes.STRING,
         allowNull:false   
        },
        wholPrice:{
            type:DataTypes.STRING,    
        },
        stock:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        },
        codeBar:{
            type:DataTypes.STRING, 
        }
    },{
        sequelize: sequelize,
        modelName: 'productos', 
        tableName: 'productos',
        timestamps: false, 
      });
}