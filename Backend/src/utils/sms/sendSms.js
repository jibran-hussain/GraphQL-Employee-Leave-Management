import twilio from 'twilio';
import 'dotenv/config';
const {TWILLIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN} = process.env;
const client = twilio(TWILLIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);

const sendSms = (recipientPhoneNumber,message)=>{
    client.messages
    .create({
        body: message,
        from: '+12513090658',
        to: recipientPhoneNumber.toString()
    })
    .then(message => console.log(message.sid))
    .catch(error=>console.log(error))
}

export default sendSms;
