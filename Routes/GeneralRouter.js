// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();

// INCLUDING CONTROLLERS
var GeneralController = require("../Controllers/GeneralController")

router.post('/login', GeneralController.login)
router.post('/refresh', GeneralController.refresh)
module.exports = router;