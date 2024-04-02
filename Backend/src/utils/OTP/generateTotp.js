import { totp } from 'otplib';
import 'dotenv/config'

const genereateTotp = ()=>{
    // configuring step (TOTP option) 
    totp.options={step:Number(process.env.TOTP_STEP)}
    const secret = process.env.TOTP_SECRET;
    const token = totp.generate(secret);
    return token;
}

export default genereateTotp;