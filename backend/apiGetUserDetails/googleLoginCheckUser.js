const database = require("../lib/database");
const { DB_NAME, USER_DETAILS } = require("../constants/database");
const { raiseError, genericErrorLog, logInfo } = require("../lib/utils");

const googleLoginCheckUser = async function(req, res){
    logInfo("googleLoginCheckUser Calling ...");
    try{
        let findBy = {};
        if(!req.body.emailId){
            raiseError(res, 'Email Id is required!');
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
        res.send({ body: { success: flag, message:"User login Successfully.", data : result}});
        return;

    }catch(err){
        await genericErrorLog(err, "apiGetUserDetails");
        res.send({ body: { success: false, message:"Something went wrong"}});
        return
    }

}


module.exports = {googleLoginCheckUser}