import { DataTypes } from  "sequelize";

export const modeloProducto = (sequelize)=>{
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
         description:{
            type:DataTypes.STRING,
            
        },
        // wholPrice:{
        //     type:DataTypes.STRING,    
        // },
        stock:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        },
        // codeBar:{
        //     type:DataTypes.STRING, 
        // }
    },{
        sequelize: sequelize,
        modelName: 'productos', 
        tableName: 'productos',
        timestamps: false, 
      });
}

export const DetailModel = (sequelize)=> {
    return sequelize.define('detalles', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
    },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
    
  },
},{
        sequelize: sequelize,
        modelName: 'detalles', 
        tableName: 'detalles',
        timestamps: false, 
      }
)}