import otpGenerator from 'otp-generator';
import { emailOtpConfig,smsOtpConfig } from '../../config/otp.js';

export const generateEmailOtp = ()=>{
    return otpGenerator.generate(emailOtpConfig.otpLength,{
        digits: emailOtpConfig.digits, // Include digits in the OTP
        lowerCaseAlphabets: emailOtpConfig.lowerCaseAlphabets, // Exclude lowercase alphabets
        upperCaseAlphabets: emailOtpConfig.upperCaseAlphabets, // Exclude uppercase alphabets
        specialChars: emailOtpConfig.specialChars // Exclude special characters
    })
};

export const generateSmsOtp = ()=>{
    return otpGenerator.generate(smsOtpConfig.otpLength,{
        digits: smsOtpConfig.digits, // Include digits in the OTP
        lowerCaseAlphabets: smsOtpConfig.lowerCaseAlphabets, // Exclude lowercase alphabets
        upperCaseAlphabets: smsOtpConfig.upperCaseAlphabets, // Exclude uppercase alphabets
        specialChars: smsOtpConfig.specialChars // Exclude special characters
    });
}


   
