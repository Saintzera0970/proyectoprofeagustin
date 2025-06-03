import { DataTypes } from  "sequelize";

export default (sequelize)=>{
    return sequelize.define("ventas",{
        id:{
            primaryKey:true,
            type:DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1
        },
        payMethod:{
            type:DataTypes.STRING,
            defaultValue:'Efectivo',
            allowNull:false
        },
        delivery:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:false
        },
        totalAmount:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        description:{
            type:DataTypes.STRING,
        },
        // clienteId:{
        //     type:DataTypes.INTEGER,
        // },
        // empleadoId:{
        //     type:DataTypes.INTEGER,
        // },
    },{
        sequelize: sequelize,
        modelName: 'ventas', 
        tableName: 'ventas',
        timestamps: true, 
    });
};