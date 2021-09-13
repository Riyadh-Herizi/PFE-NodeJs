// ADDING REQUIREMENTS 
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


// INCLUDING CONTROLLERS
var APIController = require("../Controllers/APIController")
function isloggedIn(req, res, next) {
    
        const token = req.body.token
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
    

}
router.post('/login', APIController.login)
router.post('/positions',isloggedIn, APIController.Positions)
router.post('/positionsday',isloggedIn, APIController.PositionsDay)
module.exports = router;