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
var AdminController = require("../Controllers/AdminController")

router.post('/getproflist', isAdmin , AdminController.getProfsResponsable)
router.post('/getresponsables', isAdmin , AdminController.getResponsables)
router.post('/addresponsable', isAdmin , AdminController.addResponsable)
router.post('/addprof', isAdmin , AdminController.addProf)
router.post('/updateprof', isAdmin , AdminController.updateProf)
router.post('/updatetdp_cours', isAdmin , AdminController.updateTDP_Cours)
router.post('/updatemodule', isAdmin , AdminController.updateModule)
router.post('/updaterequirement', isAdmin , AdminController.updateRequirement)
router.post('/updatesubrequirement', isAdmin , AdminController.updateSubRequirement)
router.post('/updategroup', isAdmin , AdminController.updateGroup)
router.post('/updatesection', isAdmin , AdminController.updateSection)
router.post('/makeexams', isAdmin , AdminController.makeExams)
router.post('/mail', isAdmin , AdminController.mail)
router.post('/getexamsplannings', isAdmin , AdminController.getExamsPlannings)
router.post('/getexamplanning', isAdmin , AdminController.getExamPlanning)
router.post('/generalplanning', isAdmin , AdminController.getPlanningGeneral)
router.post('/deleteprof', isAdmin , AdminController.deleteProf)
router.post('/deletetdp', isAdmin , AdminController.deleteTDP)
router.post('/deletecours', isAdmin , AdminController.deleteCours)
router.post('/deletemodule', isAdmin , AdminController.deleteModule)
router.post('/deleteplanning', isAdmin , AdminController.deletePlanning)
router.post('/deleteplanningexam', isAdmin , AdminController.deletePlanningExam)
router.post('/deleterequirement', isAdmin , AdminController.deleteRequirement)
router.post('/deletesubrequirement', isAdmin , AdminController.deleteSubRequirement)
router.post('/deletegroup', isAdmin , AdminController.deleteGroup)
router.post('/deletesection', isAdmin , AdminController.deleteSection)
router.post('/deleteresponsable', isAdmin , AdminController.deleteResponsable)
router.post('/add', isAdmin , AdminController.add)
router.post('/addsection', isAdmin , AdminController.addSection)
router.post('/addsubrequirement', isAdmin , AdminController.addSubRequirement)
router.post('/getsubrequirements', isAdmin , AdminController.getSubRequirements)
router.post('/addgroup', isAdmin , AdminController.addGroup)
router.post('/addrequirement', isAdmin , AdminController.addRequirement)
router.post('/getcours', isAdmin , AdminController.getCours)
router.post('/getsections', isAdmin , AdminController.getSections)
router.post('/getgroups', isAdmin , AdminController.getGroups)
router.post('/gettdp', isAdmin , AdminController.getTDP)
router.post('/getrequirement', isAdmin , AdminController.getRequirement)
router.post('/addmodule', isAdmin , AdminController.addModule)
router.post('/makeplanning', isAdmin , AdminController.makePlanning)
router.post('/getyears', isAdmin , AdminController.getYears)
router.post('/getmodules',isAdmin , AdminController.getModules)
router.post('/getplannings',isAdmin , AdminController.getPlannings)
router.post('/getplanning',isAdmin , AdminController.getPlanning)
router.post('/getsemesters',isAdmin , AdminController.getSemesters)
router.post('/getprofs', isAdmin , AdminController.getProfs)
router.post('/logout', isAdmin , AdminController.logout)

module.exports = router;