const { Users ,Positions ,PositionsCours,TDP , SubRequirements , Groups , Cours , Sections ,Years, Plannings} = require("../Sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment');


function compare(a, b) {
    if (a.start < b.start) {
        return -1;
    }
    if (a.start < b.start) {
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
   
    login: async (req, res) => {
        try {
            console.log(req.body)
            const body = req.body;
            if (!(body.username && body.password)) {
                return res.status(450).send({ error: "Data not formatted properly" });
            }
            const user = await Users.findOne({ where: { username: body.username , role : 1 } })
            if (user) {
                const validPassword = await bcrypt.compare(body.password, user.password);
                if (validPassword) {
                    const token = generateAccessToken(user)
                    const refreshToken = generateRefreshToken(user)
                    user.refreshtoken = refreshToken
                    await user.save()
                    res.status(200).json({ token: token,  name: user.firstname+" "+ user.lastname, id: user.id });
                } 
                else {
                    res.status(404).json({ });
                }
            }
            else {
                res.status(404).json({ })
            }
        }
        catch (err) {
            console.log(err)
            res.status(404).json({ })
        }
    },
    Positions: async (req, res) => {
        try {
            console.log(req.body)
            console.log(req.user)
            const date = moment(new Date()); 
            var day = date.day();

            if(day < 6 ) day++
            else 
            day = 0
            
            const id = req.user.id
            const positions_app = []
            const positions = await Positions.findAll(
                { where : {day : day},
                
                 include: [
                    {
                                model : Plannings,
                                required : true ,
                                include : {
                                    model: Groups,
                                required: true,
                                include : {
                                model: Sections,
                                required: true,
                                    include : {
                                    model: Years,
                                    required: true,
                                        }
                                    }
                                }},
                             {
                                model: Users,
                                required: true,
                                where : { id : id}
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
                    exist = []
                    const positionscours = await PositionsCours.findAll({
                        where : {day : day},
                        
                        include: [
                            {
                                    model : Plannings,
                                    required : true ,
                                    include : {
                                        model: Groups,
                                    required: true,
                                    include : {
                                    model: Sections,
                                    required: true,
                                        include : {
                                        model: Years,
                                         required: true,
                                            }
                                        }
                                    }}
                                    ,
                                    {
                                       model: Users,
                                       required: true,
                                       where : { id : id}
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
             
                var time_sH = positions[i].startH+""
                if (time_sH.length == 1 ) time_sH = "0"+time_sH
              

                var time_sM = positions[i].startMin+""
                if (time_sM.length == 1 ) time_sM = "0"+time_sM


                var time_eH = positions[i].endH+""
                if (time_eH.length == 1 ) time_eH = "0"+time_eH
              

                var time_eM = positions[i].endMin+""
                if (time_eM.length == 1 ) time_eM = "0"+time_eM
              


                positions_app.push({
                    start:time_sH+":"+time_sM,
                    end: time_eH+":"+time_eM,
                    place: positions[i].subrequirement.name,
                    name: positions[i].tdp.name,
                    group : positions[i].planning.group.name,
                    year : positions[i].planning.group.section.year.name
                    
                })
            }
            for (var i = 0; i < positionscours.length; i++) {
                if (!exist.includes(positionscours[i].courId+"-"+positionscours[i].planning.group.section.name)) {


                    var time_sH = positionscours[i].startH+""
                    if (time_sH.length == 1 ) time_sH = "0"+time_sH
                  
    
                    var time_sM = positionscours[i].startMin+""
                    if (time_sM.length == 1 ) time_sM = "0"+time_sM
                   
    
    
                    var time_eH = positionscours[i].endH+""
                    if (time_eH.length == 1 ) time_eH = "0"+time_eH
                  
    
                    var time_eM = positionscours[i].endMin+""
                    if (time_eM.length == 1 ) time_eM = "0"+time_eM

                positions_app.push({
                    start:time_sH+":"+time_sM,
                    end: time_eH+":"+time_eM,
                    place: positionscours[i].subrequirement.name,
                    name: positionscours[i].cour.name,
                    group : positionscours[i].planning.group.section.name,
                    year : positionscours[i].planning.group.section.year.name

                })
                exist.push(positionscours[i].courId+"-"+positionscours[i].planning.group.section.name)
            }
            else {
                console.log(exist)
            }
            }
            for (let i = 0; i < 7; i++)
            positions_app.sort(compare)

            console.log(positions_app)
            res.status(200).json(positions_app)

        }
        catch (err) {
            console.log(err)
            res.status(404).json({ error: "Ops , server down" })
        }
    },
    PositionsDay: async (req, res) => {
        try {
            
            console.log("/*/*/*/*/*//////////////////////")
            console.log(req.body)
            var day_ = req.body.day;

           
            const id = req.user.id
            const positions_app = []
            const positions = await Positions.findAll(
                { 
                    where : {day : day_},
                
                 include: [
                    {
                                model : Plannings,
                                required : true ,
                                include : {
                                    model: Groups,
                                required: true,
                                include : {
                                model: Sections,
                                required: true,
                                    include : {
                                    model: Years,
                                    required: true,
                                        }
                                    }
                                }},
                             {
                                model: Users,
                                required: true,
                                where : { id : id}
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
                    exist2 = []
                    const positionscours = await PositionsCours.findAll({
                        where : {day : day_},
                        
                        include: [
                            {
                                    model : Plannings,
                                    required : true ,
                                    include : {
                                        model: Groups,
                                    required: true,
                                    include : {
                                    model: Sections,
                                    required: true,
                                        include : {
                                        model: Years,
                                         required: true,
                                            }
                                        }
                                    }}
                                    ,
                                    {
                                       model: Users,
                                       required: true,
                                       where : { id : id}
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
             
                var time_sH = positions[i].startH+""
                if (time_sH.length == 1 ) time_sH = "0"+time_sH
              

                var time_sM = positions[i].startMin+""
                if (time_sM.length == 1 ) time_sM = "0"+time_sM


                var time_eH = positions[i].endH+""
                if (time_eH.length == 1 ) time_eH = "0"+time_eH
              

                var time_eM = positions[i].endMin+""
                if (time_eM.length == 1 ) time_eM = "0"+time_eM
              

               
                positions_app.push({
                    start:time_sH+":"+time_sM,
                    end: time_eH+":"+time_eM,
                    place: positions[i].subrequirement.name,
                    name: positions[i].tdp.name,
                    group : positions[i].planning.group.name,
                    year : positions[i].planning.group.section.year.name
                    
                })
            }
            for (var i = 0; i < positionscours.length; i++) {
                if (!exist2.includes(positionscours[i].courId+"-"+positionscours[i].planning.group.section.name)) {


                    var time_sH = positionscours[i].startH+""
                    if (time_sH.length == 1 ) time_sH = "0"+time_sH
                  
    
                    var time_sM = positionscours[i].startMin+""
                    if (time_sM.length == 1 ) time_sM = "0"+time_sM
                   
    
    
                    var time_eH = positionscours[i].endH+""
                    if (time_eH.length == 1 ) time_eH = "0"+time_eH
                  
    
                    var time_eM = positionscours[i].endMin+""
                    if (time_eM.length == 1 ) time_eM = "0"+time_eM
                  
                    positions_app.push({
                        start:time_sH+":"+time_sM,
                        end: time_eH+":"+time_eM,
                        place: positionscours[i].subrequirement.name,
                        name: positionscours[i].cour.name,
                        group : positionscours[i].planning.group.section.name,
                        year : positionscours[i].planning.group.section.year.name

                    })
                    exist2.push(positionscours[i].courId+"-"+positionscours[i].planning.group.section.name)
            }
            else {
                console.log(exist2)
            }
            }
            for (let i = 0; i < 7; i++)
            positions_app.sort(compare)

            console.log(positions_app)
            res.status(200).json(positions_app)

        }
        catch (err) {
            console.log(err)
            res.status(404).json({ error: "Ops , server down" })
        }
    },
}
module.exports = ControllerFunctions;