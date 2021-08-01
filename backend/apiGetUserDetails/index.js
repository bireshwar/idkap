const database = require("../lib/database");
const { DB_NAME, USER_DETAILS } = require("../constants/database");
const { raiseError, genericErrorLog, logInfo } = require("../lib/utils");
const jwt = require("jsonwebtoken");
const {JWT_SECRET_KEY} = require("../constants/decision");
const bcrypt = require('bcrypt');
const googleLoginCheckUser = require("../apiGetUserDetails/googleLoginCheckUser")

const apiGetUserDetails = async function(req, res){
    logInfo("apiGetUserDetails Calling ...");
    try{
        let findBy = {};
        let acc;
        if(req.body.googleLogin){
            await googleLoginCheckUser.googleLoginCheckUser(req,res)
            return
        }
        if(!req.body.emailId){
            raiseError(res, 'Email Id is required!');
            return;
        }
        if(!req.body.password){
            raiseError(res, 'Password is required!');
            return;
        }
        findBy.emailId = req.body.emailId;
        let client = await database.getClient();
        const result = await client.db(DB_NAME).collection(USER_DETAILS).findOne(findBy);
        let flag =  !result ? false : true ; 
        if(!result){
            res.send({ body: { success: flag, message: "User doesn't exist." }});
            return
        }
        let isComparePassword = await bcrypt.compare(req.body.password , result.password)
        if (!isComparePassword) {
            flag = false;
            res.send({ body: { success: flag, message:"Invalid Credentials."}});
            return
        }
        acc =  await this.accessToken(result);
        result.accesstoken = acc;
        res.send({ body: { success: flag, message:"User login Successfully.", data : result}});
        return;

    }catch(err){
        await genericErrorLog(err, "apiGetUserDetails");
        res.send({ body: { success: false, message:"Something went wrong"}});
        return
    }

}

const accessToken = function(data){
    return jwt.sign(data, JWT_SECRET_KEY) // optional , if required then  {expiresIn: '30s'}
}

const verifyToken = async function(req,res,next){
    try{
    const tokenHeader = req.headers['authorization'];
    let decodedData;
    if(typeof tokenHeader !== 'undefined'){
        const token = tokenHeader.split(' ')[1];
        req.token = token;
        let customToken = token.length< 500; // google auth token length is greater than 500
        if(customToken){
            decodedData = await jwt.verify(token , JWT_SECRET_KEY)
            req.emailId = decodedData.emailId
        }
        else{
            decodedData = await jwt.decode(token)
            if(decodedData.exp < new Date().getTime()/1000){
                res.send({ body: { success: false, message:"Season Expired. Please login"}})
            }
            req.emailId = decodedData.email; // only for google
        }
        next();
    }
    else{
        res.send({ body: { success: false, message:"Something went wrong"}});
    }
    }catch(err){
        await genericErrorLog(err, "apiGetUserDetails.verifyToken");
        res.send({ body: { success: false, message:"Something went wrong"}});
    }

}

module.exports = {apiGetUserDetails, accessToken, verifyToken}