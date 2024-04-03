import {  DataTypes } from "sequelize";
import sequelize from "../../index.js";

const Otp=sequelize.define('Otp',{
    employeeId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true
    },
    emailOtp:{
        type: DataTypes.STRING
    },
    emailOtpExpiry:{
        type: DataTypes.DATE
    },
    smsOtp:{
        type: DataTypes.STRING
    },
    smsOtpExpiry:{
        type: DataTypes.DATE
    }
})

export default Otp;