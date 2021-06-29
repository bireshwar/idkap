const database = require("../lib/database");
const { DB_NAME, MEETING_LINK } = require("../constants/database");
const { raiseError, genericErrorLog, logInfo } = require("../lib/utils");

const apiGetMeetingLinkDetails = async function(req, res){
    logInfo("apiGetMeetingLinkDetails Calling ...");
    try{
        let findBy = {};
        if(!req.query.subjectId){
            raiseError(res, 'Subject is required!');
            return;
        }
        if(!req.query.classId){
            raiseError(res, 'Class is required!');
            return;
        }

        findBy.subjectId = parseInt(req.query.subjectId);
        findBy.classId = parseInt(req.query.classId);
        findBy.isActive = true;

        let client = await database.getClient();
        const result = await client.db(DB_NAME).collection(MEETING_LINK).findOne(findBy);
        let flag =  !result ? false : true ; 
        if(!result){
            res.send({ body: { success: flag, message: "meeting has not yet started" }});
            return
        }
        res.send({ body: { success: flag, message:"Meeting Details found Successfully", data : result}});
        return;

    }catch(err){
        await genericErrorLog(err, "apiGetMeetingLinkDetails");
        res.send({ body: { success: false, message:"Something went wrong"}});
        return
    }
}


module.exports = {apiGetMeetingLinkDetails}