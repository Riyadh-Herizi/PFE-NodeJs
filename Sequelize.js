// ADDING REQUIREMENTS 
var Sequelize = require('sequelize');
const bcrypt = require("bcrypt");


// DATABASE CONNECTION
const sequelize = new Sequelize('pfe', "postgres", "Omar12452354", {
    host: 'localhost',
    dialectOptions: {
        useUTC: false 
    },
    dialect: 'postgres',
    timezone: '+05:30'
});

// ICLUDING MODELS
const UserModel = require('./Models/Users');
const Users = UserModel(sequelize, Sequelize);
const YearsModel = require('./Models/Years');
const Years = YearsModel(sequelize, Sequelize);
const SemestersModel = require('./Models/Semesters');
const Semesters = SemestersModel(sequelize, Sequelize);
const ModulesModel = require('./Models/Modules');
const Modules = ModulesModel(sequelize, Sequelize);
const CoursModel = require('./Models/Cours');
const Cours = CoursModel(sequelize, Sequelize);
const RequirementsModel = require('./Models/Requirements');
const Requirements = RequirementsModel(sequelize, Sequelize);
const ResponsablesModel = require('./Models/Responsables');
const Responsables = ResponsablesModel(sequelize, Sequelize);
const ResponsablesTDPModel = require('./Models/ResponsableTDP');
const ResponsablesTDP = ResponsablesTDPModel(sequelize, Sequelize);
const TDPModel = require('./Models/TDP');
const TDP = TDPModel(sequelize, Sequelize);
const SectionsModel = require('./Models/Sections');
const Sections = SectionsModel(sequelize, Sequelize);
const GroupsModel = require('./Models/Groups');
const Groups = GroupsModel(sequelize, Sequelize);
const SubRequirementsModel = require('./Models/SubRequirements');
const SubRequirements = SubRequirementsModel(sequelize, Sequelize);
const PlanningsModel = require('./Models/Planning');
const Plannings = PlanningsModel(sequelize, Sequelize);
const PositionsModel = require('./Models/Position');
const Positions = PositionsModel(sequelize, Sequelize);
const PositionsCoursModel = require('./Models/PositionsCours');
const PositionsCours = PositionsCoursModel(sequelize, Sequelize);

const PositionsExamsModel = require('./Models/ExamsPosition');
const ExamsPositions = PositionsExamsModel(sequelize, Sequelize);
const ExamsPlanningsModel = require('./Models/ExamsPlanning');
const ExamsPlannings = ExamsPlanningsModel(sequelize, Sequelize);


// DEFINING RELATIONS
Plannings.hasMany(Positions)
Positions.belongsTo(Plannings)

ExamsPlannings.hasMany(ExamsPositions)
ExamsPositions.belongsTo(ExamsPlannings)



Years.hasMany(ExamsPlannings)
ExamsPlannings.belongsTo(Years)


Modules.hasMany(ExamsPositions)
ExamsPositions.belongsTo(Modules)


Plannings.hasMany(PositionsCours)
PositionsCours.belongsTo(Plannings)

Groups.hasMany(Plannings)
Plannings.belongsTo(Groups)

Cours.hasMany(PositionsCours)
PositionsCours.belongsTo(Cours)

TDP.hasMany(Positions)
Positions.belongsTo(TDP)

Positions.belongsTo(Users)
Users.hasMany(Positions)

PositionsCours.belongsTo(Users)
Users.hasMany(PositionsCours)

Years.hasMany(Sections)
Sections.belongsTo(Years)

Sections.hasMany(Groups)
Groups.belongsTo(Sections)

Years.hasMany(Semesters)
Semesters.belongsTo(Years)

Semesters.hasMany(Modules)
Modules.belongsTo(Semesters)

Cours.belongsTo(Requirements)
Requirements.hasMany(Cours)

TDP.belongsTo(Requirements)
Requirements.hasMany(TDP)

Cours.hasMany(Responsables)
Responsables.belongsTo(Cours)

Users.hasMany(Responsables)
Responsables.belongsTo(Users)

TDP.hasMany(ResponsablesTDP)
ResponsablesTDP.belongsTo(TDP)

Users.hasMany(ResponsablesTDP)
ResponsablesTDP.belongsTo(Users)

Modules.hasMany(Cours)
Cours.belongsTo(Modules)

Modules.hasMany(TDP)
TDP.belongsTo(Modules)

Requirements.hasMany(SubRequirements)
SubRequirements.belongsTo(Requirements)


SubRequirements.hasMany(PositionsCours)
PositionsCours.belongsTo(SubRequirements)

SubRequirements.hasMany(Positions)
Positions.belongsTo(SubRequirements)

Semesters.hasMany(Plannings)
Plannings.belongsTo(Semesters)
sequelize.sync({ force: false })
    .then(async () => {
        // VERIEFING THE CONNECTION 
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            const admin = await Users.findOne({ where: { username: "d.bensaber" } })
            if (!admin) {
                const random = await bcrypt.genSalt(10);
                const Hashedpassword = await bcrypt.hash("12345678", random);
                await Users.create({ email: "d.amarbensaber@esi-sba.dz", firstname: "Dr.Djamel", lastname: "Amar Ben Saber", role: 0, username: "d.bensaber", password: Hashedpassword, type: "NO" })
               
                // LES PROF DE L'ESI SBA
                const h_badsi = await Users.create({ email: "h.badsi@esi-sba.dz", firstname: "Hichem", lastname: "Badsi", role: 1, username: "h.badsi", password: Hashedpassword, type: "MCB" })
                const l_allal = await Users.create({ email: "l.allal@esi-sba.dz", firstname: "Lamia", lastname: "ALLAL", role: 1, username: "l.allal", password: Hashedpassword, type: "MCB" })
                const m_aced = await Users.create({ email: "m.aced@esi-sba.dz", firstname: "Mohammed Reda", lastname: "ACED", role: 1, username: "m.aced", password: Hashedpassword, type: "MCA" })
                const m_bekkouche = await Users.create({ email: "m.bekkouche@esi-sba.dz", firstname: "Mohammed", lastname: "BEKKOUCHE", role: 1, username: "m.bekkouche", password: Hashedpassword, type: "MCB" })
                const wc_mechab = await Users.create({ email: "wc.mechab@esi-sba.dz", firstname: "Wardia Chahinez", lastname: "MECHAB", role: 1, username: "wc.mechab", password: Hashedpassword, type: "MCB" })
                const m_azza = await Users.create({ email: "m.azza@esi-sba.dz", firstname: "Mohammed", lastname: "AZZA", role: 1, username: "m.azza", password: Hashedpassword, type: "MCB" })
                const n_simohamed  = await Users.create({ email: "n.simohamed@esi-sba.dz", firstname: "Nasreddine", lastname: "SI MOHAMED", role: 1, username: "n.simohamed" , password: Hashedpassword, type: "MCB" })
                const m_mostefaoui  = await Users.create({ email: "m.mostefaoui@esi-sba.dz", firstname: "Mohammed", lastname: "MOSTEFAOUI", role: 1, username: "m.mostefaoui" , password: Hashedpassword, type: "MCA" })
                const z_mekri  = await Users.create({ email: "z.mekri@esi-sba.dz", firstname: "Zouaoui", lastname: "MEKRI", role: 1, username: "z.mekri" , password: Hashedpassword, type: "MCB" })
                const n_keskes  = await Users.create({ email: "n.keskes@esi-sba.dz", firstname: "Nabil", lastname: "KESKES", role: 1, username: "n.keskes" , password: Hashedpassword, type: "Pr" })
                const n_amroun = await Users.create({ email: "n.amroun@esi-sba.dz", firstname: "Nourdine", lastname: "AMROUN", role: 1, username: "n.amroun", password: Hashedpassword, type: "MCA" })
                const m_smahat = await Users.create({ email: "m.smahat@esi-sba.dz", firstname: "Mohammed", lastname: "SMAHAT", role: 1, username: "m.smahat", password: Hashedpassword, type: "MCB" })
                const z_helal = await Users.create({ email: "z.helal@esi-sba.dz", firstname: "Zahra", lastname: "Helal", role: 1, username: "z.helal", password: Hashedpassword, type: "MCB" })
                const b_klouche = await Users.create({ email: "b.klouche@esi-sba.dz", firstname: "Badia", lastname: "KLOUCHE", role: 1, username: "b.klouche", password: Hashedpassword, type: "MCB" })
                const k_sail = await Users.create({ email: "k.sail@esi-sba.dz", firstname: "Karima", lastname: "SAIL", role: 1, username: "k.sail", password: Hashedpassword, type: "MCB" })
                const m_mechab = await Users.create({ email: "m.mechab@esi-sba.dz", firstname: "Mustapha", lastname: "MECHAB", role: 1, username: "m.mechab", password: Hashedpassword, type: "Pr" })
                const h_mami = await Users.create({ email: "h.mami@esi-sba.dz", firstname: "Hind", lastname: "MAMI", role: 1, username: "h.mami", password: Hashedpassword, type: "MCB" })
                const m_omar = await Users.create({ email: "o.mahdaoui@esi-sba.dz", firstname: "OMAR", lastname: "Mahdaoui", role: 1, username: "o.mahdaoui", password: Hashedpassword, type: "MCB" })

                // LES ANNEES ET LES SEMESTRES DE ESI SBA
                const year1 = await Years.create({ name: "1 CPI", email: "etudiant1@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year1.id })
                await Semesters.create({ name: "Semestre 2", yearId: year1.id })
                const year2 = await Years.create({ name: "2 CPI ", email: "etudiant2@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year2.id })
                await Semesters.create({ name: "Semestre 2", yearId: year2.id })
                const year3 = await Years.create({ name: "1 CS", email: "etudiant3@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year3.id })
                await Semesters.create({ name: "Semestre 2", yearId: year3.id })
                const year4 = await Years.create({ name: "2 CS - SIW", email: "etudiant4.siw@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year4.id })
                await Semesters.create({ name: "Semestre 2", yearId: year4.id })
                const year5 = await Years.create({ name: "2 CS - ISI", email: "etudiant4.isi@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year5.id })
                await Semesters.create({ name: "Semestre 2", yearId: year5.id })
                const year6 = await Years.create({ name: "3 CS - SIW", email: "etudiant5.siw@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year6.id })
                await Semesters.create({ name: "Semestre 2", yearId: year6.id })
                const year7 = await Years.create({ name: "3 CS - ISI", email: "etudiant5.isi@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year7.id })
                await Semesters.create({ name: "Semestre 2", yearId: year7.id })

                const salles_td = await Requirements.create({ name: "Salles TD" })
                const amphis = await Requirements.create({ name: "Amphis" })
                const salles_tp = await Requirements.create({ name: "Salles TP" })


                // LES MODULE DE 1 CPI SEMESTRE 1
                const anaylse1 = await Modules.create({ name: "Anaylse 1", coefficient: 5, examenH: 2, examenMin: 0, semesterId: 1 })
                const analylse1_cour = await Cours.create({ name: "Cours - Anaylse 1", hour: 2, min: 0, moduleId: anaylse1.id, requirementId: amphis.id })
                const analylse1_cour2 = await Cours.create({ name: "Cours - Anaylse 1", hour: 1, min: 0, moduleId: anaylse1.id, requirementId: amphis.id })
                const analylse1_td = await TDP.create({ name: "TD - Anaylse 1", hour: 2, min: 0, moduleId: anaylse1.id, requirementId: salles_td.id })
                ////////////////////////////////////////////////////////////////////////////////
                const archi1 = await Modules.create({ name: "Archi 1", coefficient: 4, examenH: 2, examenMin: 0, semesterId: 1 })
                const archi1_cour = await Cours.create({ name: "Cours - Archi 1", hour: 2, min: 0, moduleId: archi1.id, requirementId: amphis.id })
                const archi1_cour2 = await Cours.create({ name: "Cours - Archi 1", hour: 1, min: 0, moduleId: archi1.id, requirementId: amphis.id })

                const archi1_td = await TDP.create({ name: "TD - Archi 1", hour: 2, min: 0, moduleId: archi1.id, requirementId: salles_td.id })
                ////////////////////////////////////////////////////////////////////////////////
                const algo1 = await Modules.create({ name: "Algorithmique 1", coefficient: 5, examenH: 2, examenMin: 0, semesterId: 1 })
                const algo1_cour = await Cours.create({ name: "Cours - Algorithmique 1", hour: 2, min: 0, moduleId: algo1.id, requirementId: amphis.id })
                const algo1_td = await TDP.create({ name: "TD - Algorithmique 1", hour: 2, min: 0, moduleId: algo1.id, requirementId: salles_td.id })
                const algo1_tp = await TDP.create({ name: "TP - Algorithmique 1", hour: 2, min: 0, moduleId: algo1.id, requirementId: salles_tp.id })
                ////////////////////////////////////////////////////////////////////////////////
                const elect = await Modules.create({ name: "Electricité ", coefficient: 3, examenH: 2, examenMin: 0, semesterId: 1 })
                const elect_cour = await Cours.create({ name: "Cours - Electricité", hour: 2, min: 0, moduleId: elect.id, requirementId: amphis.id })
                const elect_td = await TDP.create({ name: "TD - Electricité", hour: 2, min: 0, moduleId: elect.id, requirementId: salles_td.id })
                ////////////////////////////////////////////////////////////////////////////////
                const algebre1 = await Modules.create({ name: "Algébre 1", coefficient: 3, examenH: 2, examenMin: 0, semesterId: 1 })
                const algebre1_cour = await Cours.create({ name: "Cours - Algébre 1", hour: 2, min: 0, moduleId: algebre1.id, requirementId: amphis.id })
                const algebre1_td = await TDP.create({ name: "TD - Algébre 1", hour: 2, min: 0, moduleId: algebre1.id, requirementId: salles_td.id })
                ////////////////////////////////////////////////////////////////////////////////
                const btw = await Modules.create({ name: "Bureautique et web", coefficient: 1, examenH: 1, examenMin: 30, semesterId: 1 })
                const btw_tp = await TDP.create({ name: "TP - Bureautique et web", hour: 2, min: 0, moduleId: btw.id, requirementId: salles_tp.id })
                ////////////////////////////////////////////////////////////////////////////////
                const systeme1 = await Modules.create({ name: "Systèmes d'exploitation 1", coefficient: 3, examenH: 1, examenMin: 30, semesterId: 1 })
                const systeme1_tp = await TDP.create({ name: "TP - Systèmes d'exploitation 1", hour: 2, min: 0, moduleId: systeme1.id, requirementId: salles_tp.id })
                ////////////////////////////////////////////////////////////////////////////////
                const tee = await Modules.create({ name: "TEE", coefficient: 2, examenH: 1, examenMin: 30, semesterId: 1 })
                const tee_td = await TDP.create({ name: "TD - TEE", hour: 2, min: 0, moduleId: tee.id, requirementId: salles_td.id })
                 
                // LES AMPHI
                const amphiA = await SubRequirements.create({ name: "Amphi A", requirementId: amphis.id })
                await SubRequirements.create({ name: "Amphi B", requirementId: amphis.id })
                await SubRequirements.create({ name: "Amphi C", requirementId: amphis.id })
                await SubRequirements.create({ name: "Amphi D", requirementId: amphis.id })
                await SubRequirements.create({ name: "Amphi E", requirementId: amphis.id })
                
                // LES SALLES TD
                await SubRequirements.create({ name: "Salle TD 01", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 02", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 03", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 04", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 05", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 06", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 07", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 08", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 09", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD 10", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD A01", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD A02", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD A03", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD A04", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD C01", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD C02", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD C03", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD C04", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD C05", requirementId: salles_td.id })
                await SubRequirements.create({ name: "Salle TD C06", requirementId: salles_td.id })

                // LES SALLES TP
                await SubRequirements.create({ name: "Salle TP 01", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 02", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 03", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 04", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 05", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 06", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 07", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 08", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 09", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 10", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 11", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP 12", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP B13", requirementId: salles_tp.id })
                await SubRequirements.create({ name: "Salle TP B14", requirementId: salles_tp.id })
                
                
                // 1 CPI  INFO --------------------------------
                // SECTIONS
                const section1_1cpi = await Sections.create({ name: "Section A", yearId: year1.id })
                const section2_1cpi = await Sections.create({ name: "Section B", yearId: year1.id })

                // GROUPS  
                const group1_1cpi = await Groups.create({ name: "Groupe 1", sectionId: section1_1cpi.id })
                const group2_1cpi = await Groups.create({ name: "Groupe 2", sectionId: section1_1cpi.id })
                const group3_1cpi = await Groups.create({ name: "Groupe 3", sectionId: section1_1cpi.id })
                const group4_1cpi = await Groups.create({ name: "Groupe 4", sectionId: section1_1cpi.id })

                const group5_1cpi = await Groups.create({ name: "Groupe 5", sectionId: section2_1cpi.id })
                const group6_1cpi = await Groups.create({ name: "Groupe 6", sectionId: section2_1cpi.id })
                const group7_1cpi = await Groups.create({ name: "Groupe 7", sectionId: section2_1cpi.id })
                const group8_1cpi = await Groups.create({ name: "Groupe 8", sectionId: section2_1cpi.id })

                
                
                
               
                // RESPONSABLES 1 CPI - S1 
                
                // Analyse 
                await Responsables.create({ userId: n_amroun.id, courId: analylse1_cour.id })
                await Responsables.create({ userId: n_amroun.id, courId: analylse1_cour2.id })
                await ResponsablesTDP.create({ userId: n_amroun.id, tdpId: analylse1_td.id })
                await ResponsablesTDP.create({ userId: z_helal.id, tdpId: analylse1_td.id })
                await ResponsablesTDP.create({ userId: z_mekri.id, tdpId: analylse1_td.id })

                // Archi
                await Responsables.create({ userId: h_badsi.id, courId: archi1_cour.id })
                await Responsables.create({ userId: h_badsi.id, courId: archi1_cour2.id })
                await ResponsablesTDP.create({ userId: m_smahat.id, tdpId: archi1_td.id })
                await ResponsablesTDP.create({ userId: h_badsi.id, tdpId: archi1_td.id })
                
                // Algo
                await Responsables.create({ userId: n_simohamed.id, courId: algo1_cour.id })
                await ResponsablesTDP.create({ userId: n_simohamed.id, tdpId: algo1_td.id })
                await ResponsablesTDP.create({ userId: l_allal.id, tdpId: algo1_td.id })
                await ResponsablesTDP.create({ userId: n_keskes.id, tdpId: algo1_td.id })
                await ResponsablesTDP.create({ userId: n_keskes.id, tdpId: algo1_tp.id })
                await ResponsablesTDP.create({ userId: l_allal.id, tdpId: algo1_tp.id })

                // BTW 
                await ResponsablesTDP.create({ userId: m_bekkouche.id, tdpId: btw_tp.id })
                await ResponsablesTDP.create({ userId: b_klouche.id, tdpId: btw_tp.id })
                
                // Elect 
                await Responsables.create({ userId: k_sail.id, courId: elect_cour.id })
                await ResponsablesTDP.create({ userId: m_mostefaoui.id, tdpId: elect_td.id })
                await ResponsablesTDP.create({ userId: k_sail.id, tdpId: elect_td.id })
                await ResponsablesTDP.create({ userId: m_aced.id, tdpId: elect_td.id })
               
                // Algebre 
                await Responsables.create({ userId: m_mechab.id, courId: algebre1_cour.id })
                await ResponsablesTDP.create({ userId: m_mechab.id, tdpId: algebre1_td.id })
                await ResponsablesTDP.create({ userId: wc_mechab.id, tdpId: algebre1_td.id })

                // Systeme 
                await ResponsablesTDP.create({ userId: h_badsi.id, tdpId: systeme1_tp.id })
                await ResponsablesTDP.create({ userId: m_azza.id, tdpId: systeme1_tp.id })
                
                // tee 
                await ResponsablesTDP.create({ userId: h_mami.id, tdpId: tee_td.id })
                await ResponsablesTDP.create({ userId: m_omar.id, tdpId: tee_td.id })

            }

        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });


module.exports = { Users, Years, Semesters, Modules, Cours, Requirements,ExamsPlannings ,ExamsPositions, Responsables, TDP, ResponsablesTDP, Sections, Groups, SubRequirements, Plannings, Positions, PositionsCours }