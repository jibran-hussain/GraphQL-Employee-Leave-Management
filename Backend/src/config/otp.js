export const emailOtpConfig = {
    otpLength:4, // Length of OTP
    digits: true, // Include digits in the OTP or not
    lowerCaseAlphabets: false, // Include lowercase alphabets or not
    upperCaseAlphabets: false, // Include uppercase alphabets or not
    specialChars: false, // Include special characters or not
    expiryTime: 5 * 60 * 1000, // Expiry time in milliseconds
    resendLimit: 2, // Resend OTP limit
    maxResendDuration: 10 * 60 * 1000,
    cooldownPeriod: 1 * 60 * 1000 //Cooldown Period in milliseconds
}

export const smsOtpConfig = {
    otpLength:6, // Length of OTP
    digits: true, // Include digits in the OTP or not
    lowerCaseAlphabets: false, // Include lowercase alphabets or not
    upperCaseAlphabets: false, // Include uppercase alphabets or not
    specialChars: false, // Include special characters or not
    expiryTime: 5 * 60 * 1000, //Expiry time in milliseconds
    resendLimit: 10 * 60 * 1000 // Resend limit in milliseconds
}

