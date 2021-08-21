// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken')

function isAdmin(req, res, next) {
    const authHeader = req.headers.authorization
    if(authHeader) {
        const token = authHeader.split(" ")[1]
        console.log("Token : "+token)
        jwt.verify(token, process.env.TOKEN , (err, user) => {
        if (err) {
            res.status(403).send({error : "Token expired"})
        }
        else {
          
            if (user.role === 0) { 
                req.user = user
                next();
             }
          
        }
    })
    } else {
        console.log("No token ")
        res.status(401).send({error : "Not logged in"})
    }
   
  
    
}
var AdminController = require("../Controllers/AdminController")

router.post('/getuser', isAdmin , AdminController.getUserInfo)
router.post('/addprof', isAdmin , AdminController.addProf)
router.post('/addmodule', isAdmin , AdminController.addModule)
router.post('/getyears', isAdmin , AdminController.getYears)
router.post('/getsemesters', isAdmin , AdminController.getSemesters)
router.post('/getprofs', isAdmin , AdminController.getProfs)
router.post('/logout', isAdmin , AdminController.logout)
module.exports = router;