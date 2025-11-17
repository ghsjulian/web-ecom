const sendMail = require("../configs/mailer.config")


function isValidEmail(email) {
    const reSimple = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return false;
  return reSimple.test(email.trim());
}

const emailSubscribed = async (req,res)=>{
try {
    const {email} = req.body
    if (!email) throw new Error("Email Address is undefined");

    if(!isValidEmail(email)) throw new Error("Invalid email format");

    const result = await sendMail(email)
    if (!result) throw new Error("Email Subscription Failed");
    
    return res.status(200).json({
        success : true,
         message : "Email Subscription Successfully!"
    })
    
} catch (error) {
    console.log("Error In Sending Mail : ",error.message)
    return res.status(403).json({
        success : false,
         message :  error.message || "Unexpected Server Error!"
    })
}
}


module.exports = emailSubscribed