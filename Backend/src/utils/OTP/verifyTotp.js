import { totp } from 'otplib';
import 'dotenv/config'

const verifyTotp = (token)=>{
    // configuring step (TOTP option) 
    totp.options={step:Number(process.env.TOTP_STEP)}
    const secret = process.env.TOTP_SECRET;
    console.log(totp.check(token, secret),'Verified')
    return totp.check(token, secret);
}

export default verifyTotp;