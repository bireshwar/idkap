const database = require("../lib/database");
const dotenv = require('dotenv');
const { DB_NAME, USER_DETAILS, UNREGISTERED_USER_DETAILS } = require("../constants/database");
const { raiseError, genericErrorLog ,getEpochTime ,logInfo } = require("../lib/utils");
const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');
const { json } = require("body-parser");
const nodemailer = require('nodemailer');




const apiSignUpUser = async function(req, res){

    let createdTimeUnix = getEpochTime();
    const saltRounds = 10;
    

    try{
        let payload = {};
        let acc;
        
        if(!req.body.emailId){
            raiseError(res, 'Email Id is required!');
            return;
        }
        if(!req.body.password){
            raiseError(res, 'Password is required!');
            return;
        }

        payload.emailId = req.body.emailId
       // payload.password = req.body.password
        payload.roleId = req.body.roleId
        payload.roleName = req.body.roleName
        payload.firstName = req.body.firstName
        payload.lastName = req.body.lastName
        payload.stateName = req.body.stateName
        payload.district = req.body.district
        payload.schoolName = req.body.schoolName
        payload.isActive = req.body.isActive
        payload.createdTimeUnix = createdTimeUnix
        payload.createdBy = req.body.emailId
        payload.password= await bcrypt.hash(req.body.password, saltRounds)
     
        let client = await database.getClient();
        let result1 = await client
        .db(DB_NAME)
        .collection(USER_DETAILS)
        .findOne(
          { emailId: payload.emailId })
        
        if(result1){
            res.send({ body: { success: false, message:"User already exists"}});
            return
        }
        // const result2 = await client
        // .db(DB_NAME)
        // .collection(UNREGISTERED_USER_DETAILS)
        // .findOneAndUpdate(
        //   { emailId: payload.emailId },
        //   { $set: payload },
        //   { returnNewDocument: true, upsert: true }
        // );
        

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '20m'})
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_ID, // generated ethereal user
                pass: process.env.PASSWORD  // generated ethereal password
            },
            
          });
          let mailOptions = {
            from: '"IDKAP Contact" <idkap.edu@gmail.com>', // sender address
            to: payload.emailId, // list of receivers
            subject: 'Email verification IDKAP', // Subject line
            html: `<h2>Please click the link to activate</h2>
            <a href="${process.env.URL}/auth?token=${token}">Activate</a>
            
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({message: error.message})
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      
            res.send({ body: { success: true, message:"Email Has been Sent To your email."}});
        });


    }catch(err){
        await genericErrorLog(err, "apiSignUpUser");
        res.send({ body: { success: false, message:"Something went wrong"}});
        return
    }

}
module.exports = {apiSignUpUser}