const { Users, Years, Semesters, Plannings, PositionsCours, Positions, Modules, Cours, Requirements, TDP, ResponsablesTDP, Responsables, Sections, Groups, SubRequirements, ExamsPlannings, ExamsPositions } = require("../Sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function compare(a, b) {
    if (a.startH < b.startH) {
        return -1;
    }
    if (a.startH > b.startH) {
        return 1;
    }
    else if (a.startMin < b.startMin) {
        return -1;
    }
    if (a.startMin > b.startMin) {
        return 1;
    }
    return 0;
}
function compare_modules(a, b) {
    if (a.coefficient > b.coefficient) {
        return -1;
    }
    if (a.coefficient < b.coefficient) {
        return 1;
    }


    return 0;
}

 const generateAccessToken = ( user ) => {
    return jwt.sign({ role: user.role, firstname: user.firstname, lastname: user.lastname, id: user.id, username: user.username, type: user.type }, process.env.TOKEN, { expiresIn: '1d' });
 }
 const generateRefreshToken = ( user ) => {
    return jwt.sign({ role: user.role, firstname: user.firstname, lastname: user.lastname, id: user.id, username: user.username, type: user.type }, process.env.REFRESHTOKEN);
 }
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
    getSections: async (req, res) => {
        try {
            const sections = await Sections.findAll({ where: { yearId: req.body.year } })
            res.status(200).json(sections)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    
    getPlanning: async (req, res) => {
        try {
            const days = [[], [], [], [], [], [], []]
            const planning = await Plannings.findOne({
                where: {  semesterId: req.body.semester , groupId : req.body.group }, include: [

                    {
                        model: Positions,
                        required: false,
                        include: [
                            {
                                model: TDP,
                                required: true
                            },
                            {
                                model: SubRequirements,
                                required: true
                            },
                            {
                                model: Users,
                                required: true
                            }
                        ]
                    },
                    {
                        model: PositionsCours,
                        required: false,
                        include: [
                            {
                                model: Cours,
                                required: true
                            },
                            {
                                model: SubRequirements,
                                required: true
                            },
                            {
                                model: Users,
                                required: true
                            }
                        ]
                    }
                ]
            })
            console.log(planning)

            for (var i = 0; i < planning.positions.length; i++) {
                console.log("Position : " + planning.positions[i].tdp.name)
                console.log("Time start : " + planning.positions[i].startH + ":" + planning.positions[i].startMin)
                console.log("Time end : " + planning.positions[i].endH + ":" + planning.positions[i].endMin)
                console.log("Salle : " + planning.positions[i].subrequirement.name)
                console.log("day : " + planning.positions[i].day)
                console.log("Prof : " + planning.positions[i].user.firstname + " " + planning.positions[i].user.lastname)
                days[planning.positions[i].day].push({
                    startH: planning.positions[i].startH,
                    endH: planning.positions[i].endH,
                    startMin: planning.positions[i].startMin,
                    endMin: planning.positions[i].endMin,
                    requirement: planning.positions[i].subrequirement.name,
                    name: planning.positions[i].tdp.name,
                    prof: planning.positions[i].user.firstname + " " + planning.positions[i].user.lastname
                })
            }
            for (var i = 0; i < planning.positionscours.length; i++) {
                console.log("Position : " + planning.positionscours[i].cour.name)
                console.log("Time start : " + planning.positionscours[i].startH + ":" + planning.positionscours[i].startMin)
                console.log("Time end : " + planning.positionscours[i].endH + ":" + planning.positionscours[i].endMin)
                console.log("Salle : " + planning.positionscours[i].subrequirement.name)
                console.log("day : " + planning.positionscours[i].day)
                console.log("Prof : " + planning.positionscours[i].user.firstname + " " + planning.positionscours[i].user.lastname)
                days[planning.positionscours[i].day].push({
                    startH: planning.positionscours[i].startH,
                    endH: planning.positionscours[i].endH,
                    startMin: planning.positionscours[i].startMin,
                    endMin: planning.positionscours[i].endMin,
                    requirement: planning.positionscours[i].subrequirement.name,
                    name: planning.positionscours[i].cour.name,
                    prof: planning.positionscours[i].user.firstname + " " + planning.positionscours[i].user.lastname

                })
            }
            for (let i = 0; i < 7; i++)
                days[i].sort(compare)

            if (planning) 
            return  res.status(200).json({ days: days, name: planning.name })
            else 
            return  res.status(400).json({  })
            }   
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getExamPlanning: async (req, res) => {
        try {
            const body = req.body;
            console.log(body)
            const positions = await ExamsPlannings.findAll({
                where: { semesterId : body.semester , emd : body.emd },
                include: 

                    {
                        model: ExamsPositions,
                        required: true,
                        include: {
                            model: Modules,
                            required: true
                        }
                    }

                


            }
            )
            if (positions.length)
            res.status(200).json(positions[0])
            else 
            res.status(400).json({})
           
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getGroups: async (req, res) => {
        try {
            const groups = await Groups.findAll({ where: { sectionId: req.body.section } })
            res.status(200).json(groups)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getSemesters: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.yearid)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const semesters = await Semesters.findAll({ where: { yearId: body.yearid } })
            res.status(200).json(semesters)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
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
                    res.status(400).json({ error: "Nom d'utilisateur / Mot de passe érronée" });
                }
            }
            else {
                res.status(400).json({ error: "Nom d'utilisateur / Mot de passe érronée" })
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