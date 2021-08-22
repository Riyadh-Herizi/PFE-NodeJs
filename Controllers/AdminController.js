const { Users, Years, Semesters ,Modules, Cours, Requirements} = require("../Sequelize");
const bcrypt = require("bcrypt");


var ControllerFunctions = {
    getUserInfo: async (req, res) => {
        try {
            const user = await Users.findOne({ where: { id: req.user.id } })
            res.status(200).json(user)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    addProf: async (req, res) => {
        try {
            
            const body = req.body.user;
            if (!(body.username && body.password && body.type && body.firstname && body.lastname && body.email)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const existEmail = await Users.findOne({ where: { email: body.email } })
            const existUsername = await Users.findOne({ where: { username: body.username } })
            if (existEmail || existUsername) {
                if (existUsername)
                    res.status(400).send({ username: "Username exist" });
                else
                    res.status(400).send({ email: "Email exist" });
                    
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
    addModule: async (req, res) => {
        try {
            const body = req.body.module;
         
            if (!body.name) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const moduleExist = await Modules.findOne({ where: { name: body.name } })
            
            if ( moduleExist ) {
                    res.status(400).send({ module: "Module exist" });      
            }
            else {
                await Modules.create({ name: body.name,  coefficient: body.coefficient , examenH: body.examenH, examenMin: body.examenMin, semesterId: body.semester })
                res.status(200).send()
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    addCour: async (req, res) => {
        try {
            const body = req.body.cour;

            if (!body.name) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const courseExist = await Cours.findOne({ where: { name: body.name } })
            if ( courseExist ) {
                    res.status(400).send({ cour: "Cour exist" });      
            }
            else {
                await Cours.create({ name: body.name , hour: body.hour, min: body.min, moduleId: body.module ,requirementId: body.requirementId  })
                res.status(200).send()
            }

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    addRequirement: async (req, res) => {
        try {
            const body = req.body.requirement;

            if (!body.name) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const requirementExist = await Requirements.findOne({ where: { name: body.name } })
            if ( requirementExist ) {
                    res.status(400).send({ requirement: "Requirement exist" });      
            }
            else {
                await Requirements.create({ name: body.name , nombre: body.nombre})
                res.status(200).send()
            }

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getRequirement: async (req, res) => {
        try {
            const requirements = await Requirements.findAll({})
            res.status(200).json(requirements)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    
    getProfs: async (req, res) => {
        try {
            const profs = await Users.findAll({ where: { role: 1 } })
            res.status(200).json(profs)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getModules: async (req, res) => {
        try {
            const modules = await Modules.findAll({ where: { semesterId: req.body.semester } })
            res.status(200).json(modules)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getCours: async (req, res) => {
        try {
            const cours = await Cours.findAll({ where: { moduleId: req.body.module } })
            res.status(200).json(cours)
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
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const semesters = await Semesters.findAll({ where: { yearId: body.year } })
            res.status(200).json(semesters)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    logout: async (req, res) => {
        const body = req.body;
        if (!body.refreshToken) {
            return res.status(401).send({ error: "Not authenticated" })
        }
        const user = await Users.findOne({ where: { refreshtoken: body.refreshToken } })
        if (!user) {
            return res.status(403).send({ error: "Invalid refresh token" })
        }
        user.refreshtoken = "";
        await user.save()
        res.status(200).send({ message: "Logged out" })
    }
}
module.exports = ControllerFunctions;