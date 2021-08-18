const { Users } = require("../Sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var ControllerFunctions = {
    
    login: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.username && body.password)) {
                return res.status(400).send({ error: "Data not formatted properly" });
            }
            const user = await Users.findOne({ where: { username: body.username } })
            if (user) {
                const validPassword = await bcrypt.compare(body.password, user.password);
                if (validPassword) {
                    const token = jwt.sign({ user }, process.env.TOKEN, { expiresIn: '5d' });
                    res.status(200).json({ token: token, role: user.role, firstname: user.firstname, lastname: user.lastname, id: user.id, username: user.username, type: user.type });
                } else {
                    res.status(400).json({ error: "Invalid Password" });
                }
            }
            else {
                res.status(404).json({ error: "User does not exist" })
            }
        }
        catch (err) {
            console.log(err)
            res.status(404).json({ error: "Ops , server down" })
        }
    },

}
module.exports = ControllerFunctions;