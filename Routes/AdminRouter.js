// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken')


var AdminController = require("../Controllers/AdminController")

router.post('/addprof', AdminController.addProf)
router.post('/getYears', AdminController.getYears)
router.post('/getSemesters', AdminController.getSemesters)
module.exports = router;