const { Users, Years, Semesters, Plannings, PositionsCours, Positions, Modules, Cours, Requirements, TDP, ResponsablesTDP, Responsables, Sections, Groups, SubRequirements } = require("../Sequelize");
const bcrypt = require("bcrypt");
const axios = require('axios')
const { Op } = require("sequelize");

var ControllerFunctions = {

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
                    res.status(400).send({ error: "Nom d'utilisateur déja existé" });
                else
                    res.status(400).send({ error: "Email  déja existé" });

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

            if (moduleExist) {
                res.status(400).send({ module: "Module exist" });
            }
            else {
                await Modules.create({ name: body.name, coefficient: body.coefficient, examenH: body.examenH, examenMin: body.examenMin, semesterId: body.semester })
                res.status(200).send()
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    addSection: async (req, res) => {
        try {
            const body = req.body;
            if (!body.name) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const SectionExist = await Sections.findOne({ where: { name: body.name } })
            if (SectionExist) {
                return res.status(400).send({ error: "Section exist" });
            }
            else {
                await Sections.create({ name: body.name, yearId: body.year })
                res.status(200).send()
            }

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    makePlanning: async (req, res) => {
        try {
            const body = req.body;
            const group = await Groups.findOne({ where: { id: body.group } })
            const section = await Sections.findOne({ where: { id: group.id } })
            const startDate = new Date(body.start)
            const endDate = new Date(body.end)
            console.log(startDate, endDate)
            const cours = await Cours.findAll({
                include: [{
                    model: Modules,
                    required: true,
                    where: { semesterId: body.semester }
                }, {
                    model: Responsables,
                    required: false,
                    include: {
                        model: Users,
                        required: false,
                    }
                }, {
                    model: PositionsCours,
                    required: false,
                    include: {
                        model: Plannings,
                        required: true,
                        where: {
                            auto: 1, [Op.or]: [
                                { start: { [Op.between]: [startDate, endDate] } },
                                { end: { [Op.between]: [startDate, endDate] } }]
                        },
                        include: {
                            model: Groups,
                            required: true,
                            where: { sectionId: section.id }
                        }
                    }
                }]

            })

            const tdps = await TDP.findAll({
                include: [{
                    model: Modules,
                    required: true,
                    where: { semesterId: body.semester }
                }, {
                    model: ResponsablesTDP,
                    required: false,
                    include: {
                        model: Users,
                        required: true,
                    }
                }]
            })
            const profs = await Users.findAll({
                where: { role: 1 },
                include: [{
                    model: Positions,
                    required: false,
                },
                {
                    model: PositionsCours,
                    required: false,
                }]
            })
            const requirements = await SubRequirements.findAll({
                include: [{
                    model: PositionsCours,
                    required: false,
                    include: {
                        model: Plannings,
                        required: true,
                        where: {
                            auto: 1, [Op.or]: [
                                { start: { [Op.between]: [startDate, endDate] } },
                                { end: { [Op.between]: [startDate, endDate] } }]
                        }
                    }
                },
                {
                    model: Positions,
                    required: false,
                    include: {
                        model: Plannings,
                        required: true,
                        where: {
                            auto: 1, [Op.or]: [
                                { start: { [Op.between]: [startDate, endDate] } },
                                { end: { [Op.between]: [startDate, endDate] } }]
                        }
                    }
                }
                ]
            })



            axios.post('http://127.0.0.1:4001/make_planning',
                { cours: cours, tdps: tdps, profs: profs, requirements: requirements }
            )
                .then(function (response) {
                    for(let i= 0 ; i< response.data.length ;i++) {
                        console.log("day : " + i)
                        for(let j= 0 ; j< response.data[i].length ;j++) {
                            console.log(response.data[i][j].name + " "+ response.data[i][j].hour +"h "+response.data[i][j].min+"min")
                            console.log(" start : " +response.data[i][j].startH +":"+response.data[i][j].startMin)
                            console.log(" end : " +response.data[i][j].endH +":"+response.data[i][j].endMin)
                            console.log("---------------------------------------------------------" )
                        }
                    };
                    res.json(response.data)
                })
                .catch(function (error) {
                    res.send(error);
                });

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    addSubRequirement: async (req, res) => {
        try {
            const body = req.body;
            if (!body.name) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const SubRequirementsExist = await SubRequirements.findOne({ where: { name: body.name } })
            if (SubRequirementsExist) {
                return res.status(400).send({ error: "SubRequirements exist" });
            }
            else {
                await SubRequirements.create({ name: body.name, requirementId: body.requirement })
                res.status(200).send()
            }

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getSubRequirements: async (req, res) => {
        try {
            const subrequirements = await SubRequirements.findAll({ where: { requirementId: req.body.requirement } })
            res.status(200).json(subrequirements)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    addGroup: async (req, res) => {
        try {
            const body = req.body;

            if (!body.name) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const GroupsExist = await Groups.findOne({ where: { name: body.name } })
            if (GroupsExist) {
                return res.status(400).send({ error: "Groups exist" });
            }
            else {
                await Groups.create({ name: body.name, sectionId: body.section })
                res.status(200).send()
            }

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    add: async (req, res) => {
        try {
            const body = req.body.cour;
            const type = body.name;
            if (!body.name) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const module_ = await Modules.findOne({ where: { id: body.module } })
            if (type === "Cours") {
                await Cours.create({ name: "Cours - " + module_.name, hour: body.hour, min: body.min, moduleId: module_.id, requirementId: body.requirementId })
            }
            else if (type === "TP") {
                await TDP.create({ name: "TP - " + module_.name, hour: 2, min: 0, moduleId: module_.id, requirementId: body.requirementId })
            }
            else if (type === "TD") {
                await TDP.create({ name: "TD - " + module_.name, hour: 2, min: 0, moduleId: module_.id, requirementId: body.requirementId })
            }

            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getProfsResponsable: async (req, res) => {
        try {
            const body = req.body;
            const type = body.type;

            var profs = [];
            if (type === 0) {
                const result = await Responsables.findAll({ where: { courId: req.body.targetId }, attributes: ['userId'] })
                var ids = [];
                result.map((element) => {
                    ids.push(element.userId)
                })
                profs = await Users.findAll({ where: { id: { [Op.notIn]: ids }, role: 1 } })
            }
            else if (type == 1) {
                const result = await ResponsablesTDP.findAll({ where: { tdpId: req.body.targetId }, attributes: ['userId'] })
                var ids = [];
                result.map((element) => {
                    ids.push(element.userId)
                })
                profs = await Users.findAll({ where: { id: { [Op.notIn]: ids }, role: 1 } })
            }

            res.status(200).json(profs)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getResponsables: async (req, res) => {
        try {
            var responsables = [];
            const body = req.body;
            const type = req.body.type;
            if (type === 0) {
                responsables = await Users.findAll({
                    include: {
                        model: Responsables,
                        required: true,
                        where: { courId: body.targetId }
                    }
                })
            }
            else if (type === 1) {
                responsables = await Users.findAll({
                    include: {
                        model: ResponsablesTDP,
                        required: true,
                        where: { tdpId: body.targetId }
                    }
                })

            }
            res.status(200).json(responsables)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    addResponsable: async (req, res) => {
        try {
            const body = req.body;
            const type = req.body.type;
            if (type === 0) {
                const exist = await Responsables.findOne({ where: { userId: body.userId, courId: body.targetId } })
                if (exist) {
                    return res.status(400).json({ error: "Ce prof est déja un responsable " })
                }
                else {
                    await Responsables.create({ userId: body.userId, courId: body.targetId })
                }

            }
            else if (type === 1) {
                const exist_ = await ResponsablesTDP.findOne({ where: { userId: body.userId, tdpId: body.targetId } })
                if (exist_) {
                    return res.status(400).json({ error: "Ce prof est déja un responsable " })
                }
                else {
                    await ResponsablesTDP.create({ userId: body.userId, tdpId: body.targetId })
                }

            }
            res.status(200).send()
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
            if (requirementExist) {
                return res.status(400).send({ requirement: "Requirement exist" });
            }
            else {
                await Requirements.create({ name: body.name, nombre: body.nombre })
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
    getTDP: async (req, res) => {
        try {
            const tdps = await TDP.findAll({
                where: { moduleId: req.body.module }, include: {
                    model: Requirements,
                    required: true
                }
            })
            res.status(200).json(tdps)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    getCours: async (req, res) => {
        try {
            const cours = await Cours.findAll({
                where: { moduleId: req.body.module }, include: {
                    model: Requirements,
                    required: true
                }
            })
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