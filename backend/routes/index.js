var express = require('express')
const router = express.Router();
const { logInfo } = require('../lib/utils');

var apiGetUserDetails = require("../apiGetUserDetails/index")
var apiSignUpUser = require("../apiSignUpUser/index")
var apiEmailActivate = require("../apiEmailActivate/index");
var apiGetClassDetails = require('../apiGetClassDetails/index');
var apiChangeMeetingLinkStatus = require("../apiChangeMeetingLinkStatus/index");
var apiGetMeetingLinkDetails = require("../apiGetMeetingLinkDetails/index");

router.post('/apiGetUserDetails', (req,res)=>{
    apiGetUserDetails.apiGetUserDetails(req,res)
})  
router.post('/apiSignUpUser', (req,res)=>{
    
    apiSignUpUser.apiSignUpUser(req,res)
})        
router.post('/apiEmailActivate', (req,res)=>{
    apiEmailActivate.apiEmailActivate(req,res)
})  

router.get('/apiGetClassDetails',apiGetUserDetails.verifyToken,(req,res)=>{
    apiGetClassDetails.apiGetClassDetails(req,res)
})

router.get('/apiGetMeetingLinkDetails',apiGetUserDetails.verifyToken,(req,res)=>{
    apiGetMeetingLinkDetails.apiGetMeetingLinkDetails(req,res)
})

router.post('/apiChangeMeetingLinkStatus',apiGetUserDetails.verifyToken,(req,res)=>{
    apiChangeMeetingLinkStatus.apiChangeMeetingLinkStatus(req,res)
})

router.get('/', (req,res)=>{ //apiGetUserDetails.verifyToken,
    logInfo("Get Calling ...")
    res.send({"msg" : "Hii Blank"});  
})



module.exports = router;