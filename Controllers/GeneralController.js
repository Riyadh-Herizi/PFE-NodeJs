const { Users } = require("../Sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

 const generateAccessToken = ( user ) => {
    return jwt.sign({ role: user.role, firstname: user.firstname, lastname: user.lastname, id: user.id, username: user.username, type: user.type }, process.env.TOKEN, { expiresIn: '1d' });
 }
 const generateRefreshToken = ( user ) => {
    return jwt.sign({ role: user.role, firstname: user.firstname, lastname: user.lastname, id: user.id, username: user.username, type: user.type }, process.env.REFRESHTOKEN);
 }
var ControllerFunctions = {

    login: async (req, res) => {
        try {
            console.log(req.body)
            const body = req.body;
            if (!(body.username && body.password)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const user = await Users.findOne({ where: { username: body.username } })
            if (user) {
                const validPassword = await bcrypt.compare(body.password, user.password);
                if (validPassword) {
                    const token = generateAccessToken(user)
                    const refreshToken = generateRefreshToken(user)
                    user.refreshtoken = refreshToken
                    await user.save()
                    res.status(200).json({ accessToken: token, refreshToken: refreshToken,  role: user.role, firstname: user.firstname, lastname: user.lastname, id: user.id, username: user.username, type: user.type });
                } 
                else {
                    res.status(400).json({ error: "Invalid Password" });
                }
            }
            else {
                res.status(400).json({ error: "User does not exist" })
            }
        }
        catch (err) {
            console.log(err)
            res.status(404).json({ error: "Ops , server down" })
        }
    },
    refresh: async (req, res) => {
        const body = req.body;
        if(!body.refreshToken) {
            return res.status(401).send({error : "Not authenticated"})
        }
        const user = await Users.findOne({ where: { refreshtoken: body.refreshToken }})
        if(!user) {
            return res.status(403).send({error : "Invalid refresh token"})
        }
        const newToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)
        user.refreshtoken = newRefreshToken;
        await user.save()
        res.status(200).json({accessToken :newToken , refreshToken : newRefreshToken})
    }
}
module.exports = ControllerFunctions;