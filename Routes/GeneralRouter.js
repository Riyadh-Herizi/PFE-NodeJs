// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
function isLoggedIn(req, res, next) {
    const authHeader = req.headers.authorization
    if(authHeader) {
        const token = authHeader.split(" ")[1]
        console.log("Token : "+token)
        jwt.verify(token, process.env.TOKEN , (err, user) => {
        if (err) {
            res.status(403).send({error : "Token expired"})
        }
        else {
                req.user = user
                next();
        }
    })
    } else {
        console.log("No token ")
        res.status(401).send({error : "Not logged in"})
    }

}

// INCLUDING CONTROLLERS
var GeneralController = require("../Controllers/GeneralController")

router.post('/login', GeneralController.login)
router.post('/refresh', GeneralController.refresh)
router.post('/getuser', isLoggedIn , GeneralController.getUserInfo)
router.post('/getexamplanning' , GeneralController.getExamPlanning)

router.post('/getyears' , GeneralController.getYears)
router.post('/getsemesters',GeneralController.getSemesters)
router.post('/getsections', GeneralController.getSections)
router.post('/getgroups',GeneralController.getGroups)
router.post('/getplanning',GeneralController.getPlanning)



module.exports = router;