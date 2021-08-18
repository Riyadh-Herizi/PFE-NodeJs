// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken')


// INIT JWT
const SECRET_KEY = process.env.TOKEN

// INCLUDING CONTROLLERS
//var sicController = require("../../controllers/sicController")


module.exports = router;