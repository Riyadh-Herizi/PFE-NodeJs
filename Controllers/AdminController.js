const { Users ,Years, Semesters } = require("../Sequelize");
const bcrypt = require("bcrypt");



var ControllerFunctions = {

    addProf: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.username && body.password && body.type && body.firstname && body.lastname && body.email)) {
                return res.status(400).send({ error: "Data not formatted properly" });
            }
            const existEmail = await Users.findOne({ where : {email: body.email}  })
            const existUsername = await Users.findOne({ where : {username: body.username} })
            if (existEmail || existUsername) {
                if (existUsername)
                    res.status(400).send({ error: "Username exist" });
                else
                    res.status(400).send({ error: "Email exist" });
            }
            else {
                const random = await bcrypt.genSalt(10);
                const Hashedpassword = await bcrypt.hash(body.password, random);
                await Users.create({ firstname: body.firstname, lastname: body.lastname, role: 1, username: body.username, password: Hashedpassword, type: body.type, email: body.email })
                res.status(200).send()
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getYears: async (req, res) => {
        try {
            const years = await Years.findAll()
            res.status(200).json(years)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getSemesters: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.year)) {
                return res.status(400).send({ error: "Data not formatted properly" });
            }
            const semesters = await Semesters.findAll({where : {yearId : body.year}})
            res.status(200).json(semesters)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
}
module.exports = ControllerFunctions;