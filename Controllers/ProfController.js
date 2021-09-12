const { Users, Years, Semesters, Plannings, PositionsCours, Positions, Modules, Cours, Requirements, TDP, ResponsablesTDP, Responsables, Sections, Groups, SubRequirements } = require("../Sequelize");

const { Op } = require("sequelize");

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
var ControllerFunctions = {

    getPlannings : async(req,res) => {
        try {
           const body = req.body
            const plannings1 = await Plannings.findAll({ attributes: ['id'] , include : {
                model : Positions,
                required : true ,
                include : {
                    model : Users ,
                    required : true ,
                    where : { id : body.id }
                }
            }})
            const plannings2 = await Plannings.findAll({attributes: ['id'] , include : {
                model : PositionsCours,
                required : true ,
                include : {
                    model : Users ,
                    required : true ,
                    where : { id : body.id }
                }
            }})
            var id_plannings = [];

            plannings1.map((element) => {
                id_plannings.push(element.id)
            })
            plannings2.map((element) => {
                id_plannings.push(element.id)
            })
            const plannings = await Plannings.findAll({ where: { id: { [Op.in]: id_plannings } } , include : {
                model : Groups,
                required : true
            } })
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
    getPlanningGeneral: async (req, res) => {
        try {
            const body = req.body
            const days = [[], [], [], [], [], [], []]
            const positions = await Positions.findAll({
                 include: [
                             {
                                model: Users,
                                required: true,
                                where : { id : body.id}
                            }
                            , 
                            {
                                model: TDP,
                                required: true
                            }
                            ,
                            {
                                model: SubRequirements,
                                required: true
                            }
                        ]
                    })
                    const positionscours = await PositionsCours.findAll({
                        include: [
                                    {
                                       model: Users,
                                       required: true,
                                       where : { id : body.id}
                                   }
                                   , 
                                   {
                                       model: Cours,
                                       required: true
                                   }
                                   ,
                                        {
                                            model: SubRequirements,
                                            required: true
                                        }
                               ]
                           })
           

            for (var i = 0; i < positions.length; i++) {
                console.log("Position : " + positions[i].tdp.name)
                console.log("Time start : " + positions[i].startH + ":" + positions[i].startMin)
                console.log("Time end : " + positions[i].endH + ":" + positions[i].endMin)
                console.log("Salle : " + positions[i].subrequirement.name)
                console.log("day : " + positions[i].day)
                console.log("Prof : " + positions[i].user.firstname + " " + positions[i].user.lastname)
                days[positions[i].day].push({
                    startH: positions[i].startH,
                    endH: positions[i].endH,
                    startMin: positions[i].startMin,
                    endMin: positions[i].endMin,
                    requirement: positions[i].subrequirement.name,
                    name: positions[i].tdp.name,
                    prof: positions[i].user.firstname + " " + positions[i].user.lastname
                })
            }
            for (var i = 0; i < positionscours.length; i++) {
                console.log("Position : " +positionscours[i].cour.name)
                console.log("Time start : " +positionscours[i].startH + ":" +positionscours[i].startMin)
                console.log("Time end : " +positionscours[i].endH + ":" +positionscours[i].endMin)
                console.log("Salle : " +positionscours[i].subrequirement.name)
                console.log("day : " +positionscours[i].day)
                console.log("Prof : " +positionscours[i].user.firstname + " " +positionscours[i].user.lastname)
                days[positionscours[i].day].push({
                    startH:positionscours[i].startH,
                    endH:positionscours[i].endH,
                    startMin:positionscours[i].startMin,
                    endMin:positionscours[i].endMin,
                    requirement:positionscours[i].subrequirement.name,
                    name:positionscours[i].cour.name,
                    prof:positionscours[i].user.firstname + " " +positionscours[i].user.lastname

                })
            }
            for (let i = 0; i < 7; i++)
                days[i].sort(compare)
            res.status(200).json({ days: days, name: "Planning générale" })
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