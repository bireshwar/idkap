const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DB_NAME: process.env.DB_NAME,
    USER_ROLES_COLL: "roleMatrix",
    SEQUENCE_COLLECTION_NAME: "sequences",
    USER_DETAILS: "userDetails",
    UNREGISTERED_USER_DETAILS : "userDetailsHist",
    GENERIC_ERR_LOG : "genericErrorLog",
    CLASS_DETAILS:"classDetails",
    MEETING_LINK: "meetingLinkDetails"
}