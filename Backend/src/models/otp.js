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
    },
    emailOtpResendAttemptsCount:{
        type:DataTypes.INTEGER,
        defaultValue: 0
    },
    emailOtpFirstResendAttempt:{
        type: DataTypes.DATE
    },
    emailOtplastResendAttempt:{
        type: DataTypes.DATE
    },
    smsOtpResendAttemptsCount:{
        type:DataTypes.INTEGER,
        defaultValue: 0
    },
    smsOtpFirstResendAttempt:{
        type: DataTypes.DATE
    },
    smsOtplastResendAttempt:{
        type: DataTypes.DATE
    },
    totpSecret:{
        type: DataTypes.STRING
    }
})

export default Otp;