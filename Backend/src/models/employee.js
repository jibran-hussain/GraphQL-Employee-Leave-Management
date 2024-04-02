import { DataTypes } from 'sequelize';
import sequelize from '../../index.js'

const Employee= sequelize.define('Employee',{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        hashedPassword:{
            type:DataTypes.STRING,
            allowNull:false
        },
        designation:{
            type:DataTypes.STRING,
            defaultValue:'Software Engineer',
            allowNull:false
        },
        mobileNumber:{
            type:DataTypes.BIGINT,
        },
        salary:{
            type:DataTypes.DOUBLE.UNSIGNED,
        },
        role:{
            type:DataTypes.STRING(10),
            allowNull:false
        },
        profilePictureURL:{
            type:DataTypes.TEXT
        },
        leavesLeft:{
            type:DataTypes.INTEGER,
            defaultValue:20
        },
        mfaEnabled:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        mfaSettings:{
            type: DataTypes.JSONB,
            defaultValue:{
                emailOtp:false,
                smsOtp: false,
                totp: false
            }
        }
    },{
        paranoid:true
    })


    export default Employee
