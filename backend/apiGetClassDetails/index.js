const database = require("../lib/database");
const { DB_NAME, CLASS_DETAILS } = require("../constants/database");
const { raiseError, genericErrorLog, logInfo } = require("../lib/utils");

const apiGetClassDetails = async function(req, res){
    logInfo("apiGetClassDetails Calling ...");
    try{
        let findBy = {};
        if(!req.query.emailId){
            raiseError(res, 'Email Id is required!');
            return;
        }

        findBy.emailId = req.query.emailId;
        let client = await database.getClient();
        const result = await client.db(DB_NAME).collection(CLASS_DETAILS).findOne(findBy);
        let flag =  !result ? false : true ; 
        if(!result){
            res.send({ body: { success: flag, message: "Class Details doesn't exist." }});
            return
        }
        res.send({ body: { success: flag, message:"Class Details found Successfully", data : result}});
        return;

    }catch(err){
        await genericErrorLog(err, "apiGetClassDetails");
        res.send({ body: { success: false, message:"Something went wrong"}});
        return
    }
}


module.exports = {apiGetClassDetails}