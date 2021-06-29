const database = require("../lib/database");
const {
  DB_NAME,
  USER_DETAILS,
  UNREGISTERED_USER_DETAILS,
} = require("../constants/database");
const {
  raiseError,
  genericErrorLog,
  getEpochTime,
  logInfo,
} = require("../lib/utils");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY  } = require("../constants/decision");


const apiEmailActivate = async function (req, res) {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async function (err, decoded) {
      if (err) {
        return  res.send({ body: { success: false, message: "invalid/expried"}});
      //  res.json({ message: "invalid/expried" });
      }
      let payload ={}
      payload.emailId = decoded.emailId
        payload.password = decoded.password
        payload.roleId = decoded.roleId
        payload.roleName =decoded.roleName
        payload.firstName = decoded.firstName
        payload.lastName = decoded.lastName
        payload.stateName = decoded.stateName
        payload.district = decoded.district
        payload.schoolName = decoded.schoolName
        payload.isActive = decoded.isActive
        payload.createdTimeUnix = decoded.createdTimeUnix
        payload.createdBy = decoded.emailId
        
        let client = await database.getClient();
     const result = await client
        .db(DB_NAME)
        .collection(USER_DETAILS)
        .findOneAndUpdate(
          { emailId: payload.emailId },
          { $set: payload },
          { returnNewDocument: true, upsert: true }
        );
      // send response
      res.send({ body: { success: true, message:"User SignUp Successfully.", data : result}});
      //context.res = { body: { success: true, data: result.value } };
      return;


    });
  } else {
    res.json({ error: "something went wrong" });
  }
};
module.exports = { apiEmailActivate };
