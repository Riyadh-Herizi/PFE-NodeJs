const { Users, Years, Semesters, Plannings, PositionsCours, Positions, Modules, Cours, Requirements, TDP, ResponsablesTDP, Responsables, Sections, Groups, SubRequirements, ExamsPlannings, ExamsPositions } = require("../Sequelize");
const bcrypt = require("bcrypt");
const axios = require('axios')
const { Op } = require("sequelize");
const Planning = require("../Models/Planning");
const moment = require("moment")
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

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
    updateProf: async (req, res) => {
        try {

            const body = req.body;
            if (!(body.username && body.type && body.firstname && body.lastname && body.email)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const existEmail = await Users.findOne({ where: { email: body.email, id: { [Op.ne]: body.id } } })
            const existUsername = await Users.findOne({ where: { username: body.username, id: { [Op.ne]: body.id } } })
            if (existEmail || existUsername) {
                if (existUsername)
                    res.status(400).send({ error: "Nom d'utilisateur est occupé par un autre utilisateur" });
                else
                    res.status(400).send({ error: "Email est occupé par un autre utilisateur" });

            }
            else {

                await Users.update({ firstname: body.firstname, lastname: body.lastname, username: body.username, type: body.type, email: body.email },
                    { where: { id: body.id } })

                res.status(200).send()
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteProf: async (req, res) => {
        try {

            const body = req.body;
            const positions = await Positions.findAll({ where: { userId: body.id } })
            const positionscours = await PositionsCours.findAll({ where: { userId: body.id } })
            if (positions.length || positionscours.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer cet enseignant a cause de sa participation aux plannings" });
            }

            await Responsables.destroy({ where: { userId: body.id } });
            await ResponsablesTDP.destroy({ where: { userId: body.id } });
            await Users.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteTDP: async (req, res) => {
        try {

            const body = req.body;
            const positions = await Positions.findAll({ where: { tdpId: body.id } })
            if (positions.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer ce TD / TP a cause de sa participation aux plannings" });
            }
            await ResponsablesTDP.destroy({
                where: { tdpId: body.id }
            });
            await TDP.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    updateTDP_Cours: async (req, res) => {
        try {

            const body = req.body;
            if (body.type == 0) {

                const positionscours = await PositionsCours.findAll({ where: { courId: body.id  } })
                if (positionscours.length) {
                        res.status(400).send({ error: " Vous ne pouvez pas modifier ce cours a cause de sa présence dans les plannings" });
                }
                else {
    
                    await Cours.update({  hour: body.hour, min: body.min , requirementId : requirement },
                        { where: { id: body.id } })
    
                    res.status(200).send()
                }

            }
            else {
                const positions = await Positions.findAll({ where: { tdpId: body.id  } })
           
                if (positions.length) {
                        res.status(400).send({ error: " Vous ne pouvez pas modifier ce TD/TP a cause de sa présence dans les plannings" });
                }
                else {
                    
                    await TDP.update({  hour: body.hour, min: body.min , requirementId : requirement  },
                        { where: { id: body.id } }) 

                    res.status(200).send()
                }

            }
            
           
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteCours: async (req, res) => {
        try {

            const body = req.body;
            const positions = await PositionsCours.findAll({ where: { courId: body.id } })

            if (positions.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer ce cours a cause de sa participation aux plannings" });
            }
            await Responsables.destroy({
                where: { courId: body.id }
            });

            await Cours.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteGroup: async (req, res) => {
        try {

            const body = req.body;
            const plannings = await Plannings.findAll({ where: { groupId: body.id } })

            if (plannings.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer ce group, supprimmer son planning d'abord " });
            }

            await Groups.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    updateGroup: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.name)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            await Groups.update({ name: body.name },
                { where: { id: body.id } })

            res.status(200).send()
           
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteResponsable: async (req, res) => {
        try {
            const body = req.body;
            if (body.type == 0)
                await Responsables.destroy({ where: { id: body.id } });
            else
                await ResponsablesTDP.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteSection: async (req, res) => {
        try {
            const body = req.body;
            const plannings = await Plannings.findAll({
                include: {
                    model: Groups, required: true, where: { sectionId: body.id }
                }
            })

            if (plannings.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer ce section, supprimmer ses plannings d'abord " });
            }
            await Groups.destroy({ where: { sectionId: body.id } });
            await Sections.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    updateSection: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.name)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            await Sections.update({ name: body.name },
                { where: { id: body.id } })

            res.status(200).send()
           
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteSubRequirement: async (req, res) => {
        try {

            const body = req.body;
            const positions = await Positions.findAll({ where: { subrequirementId: body.id } })
            const positionscours = await PositionsCours.findAll({ where: { subrequirementId: body.id } })
            if (positions.length || positionscours.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer cet endroit, a cause d'utilisation dans les plannings" });
            }
            await SubRequirements.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    updateSubRequirement: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.name)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            await SubRequirements.update({ name: body.name },
                { where: { id: body.id } })

            res.status(200).send()
           
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteRequirement: async (req, res) => {
        try {
            const body = req.body;
            const positions = await Positions.findAll({
                include: {
                    model: SubRequirements, required: true, where: { requirementId: body.id }
                }
            })
            const positionscours = await PositionsCours.findAll({
                include: {
                    model: SubRequirements, required: true, where: { requirementId: body.id }
                }
            })

            const cours = await Cours.findAll({ where: { requirementId: body.id } })
            const tdps = await TDP.findAll({ where: { requirementId: body.id } })

            if (positions.length || positionscours.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer ce type d'endroit, a cause d'utilisation dans les plannings " });
            }
            else if (tdps.length || cours.length ) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer ce type d'endroit, a cause d'affectation dans les modules " });
            }

            await SubRequirements.destroy({ where: { requirementId: body.id } });
            await Requirements.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    updateRequirement: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.name)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            await Requirements.update({ name: body.name },
                { where: { id: body.id } })

            res.status(200).send()
           
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deletePlanning: async (req, res) => {
        try {
            const body = req.body;
            await Positions.destroy({ where: { planningId: body.id } })
            await PositionsCours.destroy({ where: { planningId: body.id } })
            await Plannings.destroy({ where: { id: body.id } });
            res.status(200).send()

        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },
    deleteModule: async (req, res) => {
        try {

            const body = req.body;
            const positions = await Positions.findAll({ include: { model: TDP, required: true, where: { moduleId: body.id } } })
            const positionscours = await PositionsCours.findAll({ include: { model: Cours, required: true, where: { moduleId: body.id } } })
            if (positions.length || positionscours.length) {
                return res.status(400).send({ error: "vous ne pouvez pas supprimer ce module a cause de sa participation aux plannings" });
            }

            await Responsables.destroy({
                include: {
                    model: Cours, where: { moduleId: body.id }
                }
            });
            await ResponsablesTDP.destroy({
                include: {
                    model: TDP, where: { moduleId: body.id }
                }
            });

            await TDP.destroy({ where: { moduleId: body.id } });
            await Cours.destroy({ where: { moduleId: body.id } });

            await Modules.destroy({ where: { id: body.id } });
            res.status(200).send()
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
    updateModule: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.name)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            await Modules.update({ name: body.name , examenH : body.hour , examenMin : body.min , coefficient : body.coefficient },
                { where: { id: body.id } })

            res.status(200).send()
           
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


            const exist = await Plannings.findOne({ where: { groupId: body.group, semesterId: body.semester } })

            if (!exist) {
                const group = await Groups.findOne({ where: { id: body.group } })
                const section = await Sections.findOne({ where: { id: group.sectionId }, include: { model: Years, required: true } })

                const result = await Groups.findAll({ where: { sectionId: section.id }, attributes: ['id'] })
                var ids = [];
                result.map((element) => {
                    ids.push(element.id)
                })

                const semesters = await Semesters.findAll({ where: { name: { [Op.like]: '%1%' } }, attributes: ['id'] })

                var id_semesters = [];

                semesters.map((element) => {
                    id_semesters.push(element.id)
                })

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
                            include: [{
                                model: Positions,
                                required: false,
                                include: {
                                    model: Plannings,
                                    required: true,
                                    where: {
                                        auto: 1, statut: 1,
                                        semesterId: { [Op.in]: id_semesters }

                                    },

                                },
                            },
                            {
                                model: PositionsCours,
                                required: false,
                                include: {
                                    model: Plannings,
                                    required: true,
                                    where: {
                                        auto: 1, statut: 1,
                                        semesterId: { [Op.in]: id_semesters }
                                    },

                                },
                            }]
                        }
                    }, {
                        model: PositionsCours,
                        required: false,
                        include: [{
                            model: Plannings,
                            required: true,
                            where: {
                                auto: 1, statut: 1,
                                groupId: { [Op.in]: ids },
                                semesterId: { [Op.in]: id_semesters }

                            },

                        },
                        {
                            model: Users,
                            required: true,
                        },
                        {
                            model: SubRequirements,
                            required: true,
                        }]
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
                            include: [{
                                model: Positions,
                                required: false,
                            },
                            {
                                model: PositionsCours,
                                required: false,
                            }]
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
                                auto: 1, statut: 1
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
                                auto: 1, statut: 1
                            }
                        }
                    }
                    ]
                })

                const planning = await Plannings.create({
                    auto: 1, groupId: group.id, name: "Planning " + section.year.name + "- " + section.name + " "
                        + group.name, semesterId: body.semester, statut: 0
                })
                res.status(200).json({ message: "Votre demande est en cours de traitement, veuillez patienter" })

                axios.post('http://127.0.0.1:4001/make_planning',
                    { cours: cours, tdps: tdps, profs: profs, requirements: requirements }
                )
                    .then(async function (response) {
                        if (response.data.length == 0) {
                            console.log("planning vide ")
                            await Plannings.update(
                                { statut: -1 },
                                { where: { id: planning.id } }
                            )
                        }
                        else {



                            for (let i = 0; i < response.data.length; i++) {

                                if (response.data[i].type == 0) {
                                    console.log("user : " + response.data[i].prof.user.id)
                                    console.log("planning : " + response.data[i].prof.user.id)
                                    await PositionsCours.create({
                                        userId: response.data[i].prof.user.id, planningId: planning.id, day: response.data[i].day,
                                        startH: response.data[i].startH, startMin: response.data[i].startMin, endH: response.data[i].endH, endMin: response.data[i].endMin
                                        , courId: response.data[i].id, subrequirementId: response.data[i].requirement.id
                                    })
                                }
                                else {

                                    await Positions.create({
                                        userId: response.data[i].prof.user.id, planningId: planning.id, day: response.data[i].day,
                                        startH: response.data[i].startH, startMin: response.data[i].startMin, endH: response.data[i].endH, endMin: response.data[i].endMin
                                        , tdpId: response.data[i].id, subrequirementId: response.data[i].requirement.id
                                    })

                                }



                            }
                            await Plannings.update(
                                { statut: 1 },
                                { where: { id: planning.id } }
                            )

                        }

                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            }
            else {
                res.status(400).json({ error: "Ce groupe a déja un planning." })
            }


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
                responsables = await Responsables.findAll({
                    where: { courId: body.targetId } ,
                    include: {
                        model: Users,
                        required: true,
                        
                    }
                })
            }
            else if (type === 1) {
                responsables = await ResponsablesTDP.findAll({
                    where: { tdpId: body.targetId },
                    include: {
                        model: Users,
                        required: true,
                        
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
    getPlannings: async (req, res) => {
        try {
            const semesters = await Semesters.findAll({ where: { yearId: req.body.yearId }, attributes: ['id'] })
            var id_semesters = [];

            semesters.map((element) => {
                id_semesters.push(element.id)
            })
            const plannings = await Plannings.findAll({ where: { semesterId: { [Op.in]: id_semesters } } })
            res.status(200).json(plannings)
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
                where: { id: req.body.planningId }, include: [

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
            res.status(200).json({ days: days, name: planning.name })
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
    getExamsPlannings: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.year)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const plannings = await ExamsPlannings.findAll({ where: { yearId: body.year } })
            res.status(200).json(plannings)
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },

    getExamPlanning: async (req, res) => {
        try {
            const body = req.body;
            if (!(body.id)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const positions = await ExamsPlannings.findAll({ where: { id: body.id } ,
                include : [

                    {
                        model : ExamsPositions,
                        required :  true,
                        include : {
                            model : Modules,
                            required:true
                        }
                    }

                ]
            
            
            }  
               )
            res.status(200).json(positions)
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
    },
    makeExams: async (req, res) => {
        try {
            const body = req.body;
            var days = []
            var modules =  await Modules.findAll( {where :{ semesterId: body.semester } })
            var dates = getDates(new Date(body.start) , new Date(body.end))

            if (dates.length * 2 < modules.length) {
                res.status(400).json({error : "Les jours insufissants"})
            }
            else {
                dates.map( async (element)=> {
               

                var day = moment(element).day(); 


                if(day < 6 ) day++
                else 
                day = 0
                var name_day = ""
                if(day == 0) name_day = "Samedi"
                if(day == 1) name_day = "Dimanche"
                if(day == 2) name_day = "Lundi"
                if(day == 3) name_day = "Mardi"
                if(day == 4) name_day = "Mercredi"
                if(day == 5) name_day = "Jeudi"
                if (day != 6) {
                    if (day == 0) {

                        if (body.samdi  == 1) {
                                days.push({ 
                                    date : moment(element).format('YYYY-MM-DD') ,
                                    examens : [],
                                    name : name_day
                                })
                            }
                    }
                    else {

                        days.push({ 
                            date : moment(element).format('YYYY-MM-DD') ,
                            examens : [],
                            name : name_day
                        })

                        
                    }
                 }

               

            })
            for (let i = 0 ; i< modules.length ;i++) {
                var prof = ""
                const cours = await Cours.findAll({where : {moduleId: modules[i].id} ,
                include : {
                    model : Responsables ,
                    required : false,
                    include : {
                        model : Users,
                        required : true
                    }
                }} ) 
                const tdps = await TDP.findAll({where : {moduleId: modules[i].id} ,
                    include : {
                        model : ResponsablesTDP ,
                        required : false ,
                        include : {
                            model : Users,
                            required : true
                        }
                    }} ) 
                 
                    if (cours.length) {
                        cours.map((cour)=> {
                            if(cour.responsables.length > 0) {
                                prof = cour.responsables[0].user.firstname +" "+cour.responsables[0].user.lastname        
                            }
                        })
                }
                else if (tdps.length) {
                    tdps.map((tdp)=> {
                        if(tdp.responsablestdps.length > 0) {
                            prof = tdp.responsablestdps[0].user.firstname +" "+tdp.responsablestdps[0].user.lastname
                        }
                    })
                }
                
                modules[i].prof = prof
            
            
            }
            
            modules.sort(compare_modules)
            
            var counter =0

            for( let i= 0 ; i< modules.length ;i++) {
            counter = counter % days.length
            if ( days[counter].examens.length > 2) {
                i--
            } 
            else {
                days[counter].examens.push(
                 {
                    module :modules[i],
                    time : { 
                        start : {
                            hour : 0,
                            min : 0
                        },
                        end : {
                            hour : 0,
                            min : 0
                        }
                    }
                }
            )
            counter++
            }
            

            counter++


            }

            for( let i= 0 ; i< days.length ;i++) {
                
                if(days[i].examens.length == 1 ) {
                    days[i].examens[0].time.start.hour = 10
                    days[i].examens[0].time.start.min = 0
                    days[i].examens[0].time.end.hour = 10 + days[i].examens[0].module.examenH
                    days[i].examens[0].time.end.min =  days[i].examens[0].module.examenMin
                }
                else {
                    days[i].examens[0].time.start.hour = 8
                    days[i].examens[0].time.start.min = 0
                    days[i].examens[0].time.end.hour = 8 + days[i].examens[0].module.examenH
                    days[i].examens[0].time.end.min =  days[i].examens[0].module.examenMin

                    days[i].examens[1].time.start.hour = 14
                    days[i].examens[1].time.start.min = 0
                    days[i].examens[1].time.end.hour = 14 + days[i].examens[0].module.examenH
                    days[i].examens[1].time.end.min =  days[i].examens[0].module.examenMin
                }


            }


            const semester = await Semesters.findOne({where : {id : body.semester} , 
                include : {
                    model : Years,
                    required : true
                } })


            const planning = await ExamsPlannings.create({
                auto: 1, semesterId: body.semester, name: "Planning d'examen " + semester.year.name+" "+ body.emd , yearId : semester.year.id , emd :body.emd
            })

            for (let i = 0 ; i <days.length ; i++ ) {
                if(days[i].examens.length == 1 ) {
                    await ExamsPositions.create({
                    examsplanningId: planning.id, date: days[i].date,
                    startH:days[i].examens[0].time.start.hour, startMin: days[i].examens[0].time.start.min, endH: days[i].examens[0].time.end.hour,
                     endMin: days[i].examens[0].time.end.min
                    , moduleId: days[i].examens[0].module.id , prof : days[i].examens[0].module.prof
                })

                 }
                else {
                    await ExamsPositions.create({
                        examsplanningId: planning.id, date: days[i].date,
                        startH:days[i].examens[0].time.start.hour, startMin: days[i].examens[0].time.start.min, endH: days[i].examens[0].time.end.hour,
                         endMin: days[i].examens[0].time.end.min
                        , moduleId: days[i].examens[0].module.id, prof : days[i].examens[0].module.prof
                    })

                    await ExamsPositions.create({
                        examsplanningId: planning.id, date: days[i].date,
                        startH:days[i].examens[1].time.start.hour, startMin: days[i].examens[1].time.start.min, endH: days[i].examens[1].time.end.hour,
                         endMin: days[i].examens[1].time.end.min
                        , moduleId: days[i].examens[1].module.id, prof : days[i].examens[0].module.prof
                    })

                }
                
            }


            res.status(200).json(days)




            }


            
           
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ error: "Ops , server down" })
        }
    },

}
module.exports = ControllerFunctions;