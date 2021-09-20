// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken')

function isProf(req, res, next) {
    
    const authHeader = req.headers.authorization
    if(authHeader) {
        const token = authHeader.split(" ")[1]
        console.log("Token : "+token)
        jwt.verify(token, process.env.TOKEN , (err, user) => {
        if (err) {
            res.status(403).send({error : "Token expired"})
        }
        else {
            if (user.role === 1) { 
                req.user = user
                next();
            }
            else {
                res.status(403).send({error : "Not your role"})
            }
        }

    })
    } else {
        console.log("No token ")
        res.status(401).send({error : "Not logged in"})
    }

}

// INIT JWT
const SECRET_KEY = process.env.TOKEN

// INCLUDING CONTROLLERS
var ProfController = require("../Controllers/ProfController")
router.post('/getplanning', isProf , ProfController.getPlanning)
router.post('/generalplanning', isProf , ProfController.getPlanningGeneral)
router.post('/getplannings', isProf , ProfController.getPlannings)
router.post('/getyears', isProf , ProfController.getYears)
router.post('/getallplannings',isProf , ProfController.getallPlannings)
router.post('/getexamsplannings', isProf , ProfController.getExamsPlannings)
router.post('/getexamplanning', isProf , ProfController.getExamPlanning)

module.exports = router;