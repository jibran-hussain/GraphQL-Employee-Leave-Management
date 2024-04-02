import transporter from "../../config/email.js";

const sendEmail = async(from,to,subject,text,html)=>{
    try{
        const info = await transporter.sendMail({
            from, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
          });
    }catch(error){
        console.log(error.message)
    }
}

export default sendEmail;