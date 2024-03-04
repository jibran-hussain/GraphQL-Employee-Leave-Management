import { DataTypes } from 'sequelize';
import sequelize from '../../index.js';

const Leave=sequelize.define('Leave',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    reason:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    dates:{
        type:DataTypes.ARRAY(DataTypes.DATEONLY),
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Under Process',
        validate: {
            isIn: [['approved', 'rejected','Under Process']]
        }
    },
    rejectionReason:{
        type:DataTypes.TEXT
    }
},{
    paranoid:true
})

export default Leave;