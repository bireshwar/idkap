const database = require("../lib/database");
const { DB_NAME, MEETING_LINK } = require("../constants/database");
const { raiseError, genericErrorLog, logInfo } = require("../lib/utils");
const { TEACHER } = require("../constants/decision");

const apiChangeMeetingLinkStatus = async function(req, res){
    logInfo("apiChangeMeetingLinkStatus Calling ...");
    try{
        let findBy = {};
        let params = {};
        if(parseInt(req.body.roleId) != TEACHER){
            raiseError(res, 'Teacher Role is Required to start meeting');
            return;
        }
        if(!req.body.subjectId){
            raiseError(res, 'Subject is required!');
            return;
        }
        if(!req.body.classId){
            raiseError(res, 'Class is required!');
            return;
        }

        findBy.subjectId = parseInt(req.body.subjectId);
        findBy.classId = parseInt(req.body.classId);
        // dont send isActive then by default set false. this is usefull for creating meeting list for every subject by admin and 
        // when end meeting then by socket io this status turn into false
        params.isActive = req.body.isActive || false; 

        let client = await database.getClient();
        const result = await client.db(DB_NAME).collection(MEETING_LINK).findOneAndUpdate(
            findBy,
            { $set: params },
            { returnNewDocument: true, upsert: false, returnOriginal: false }
        );
        let flag =  !result ? false : true ; 
        if(!result){
            res.send({ body: { success: flag, message: "Meeting doesn't exist." }});
            return
        }
        res.send({ body: { success: flag, message:"Meeting Status Change Successfully", data : result}});
        return;

    }catch(err){
        await genericErrorLog(err, "apiChangeMeetingLinkStatus");
        res.send({ body: { success: false, message:"Something went wrong"}});
        return
    }
}


module.exports = {apiChangeMeetingLinkStatus}