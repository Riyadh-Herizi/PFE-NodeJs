// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken')

function isAdmin(req, res, next) {
    const body = req.body;
    if(!body.token) {
        return  res.status(401).send({error : "No token found"});
    }
    var token = body.token
    jwt.verify(token, process.env.TOKEN , (err, decode) => {
        if (err) {
            res.status(401).send();
        }
        else {
            console.log(decode.user)
            if (decode.user.role === 0) { 
                req.user = decode.user
                next();
             }
          
        }
    })
}
var AdminController = require("../Controllers/AdminController")

router.post('/getuser', isAdmin , AdminController.getUserInfo)
router.post('/addprof', isAdmin , AdminController.addProf)
router.post('/getyears', isAdmin , AdminController.getYears)
router.post('/getsemesters', isAdmin , AdminController.getSemesters)
router.post('/getprofs', isAdmin , AdminController.getProfs)

module.exports = router;