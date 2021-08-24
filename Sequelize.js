// ADDING REQUIREMENTS 
var Sequelize = require('sequelize');
const bcrypt = require("bcrypt");


// DATABASE CONNECTION
const sequelize = new Sequelize('pfe', "postgres", "root", {
    host: 'localhost',
    dialect: 'postgres'
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
// DEFINING RELATIONS

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
                await Users.create({ email: "n.mahammed@esi-sba.dz", firstname: "Nadir", lastname: "Mahammed", role: 1, username: "n.mahammed", password: Hashedpassword, type: "MCA" })
            }
            const years = await Years.findAll({})
            if (!years.length) {
                const year1 = await Years.create({ name: "1er cycle préparatoire", email: "etudiant1@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year1.id })
                await Semesters.create({ name: "Semestre 2", yearId: year1.id })
                const year2 = await Years.create({ name: "2eme cycle préparatoire", email: "etudiant2@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year2.id })
                await Semesters.create({ name: "Semestre 2", yearId: year2.id })
                const year3 = await Years.create({ name: "1er cycle supérieur", email: "etudiant3@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year3.id })
                await Semesters.create({ name: "Semestre 2", yearId: year3.id })
                const year4 = await Years.create({ name: "2eme cycle supérieur - SIW", email: "etudiant4.siw@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year4.id })
                await Semesters.create({ name: "Semestre 2", yearId: year4.id })
                const year5 = await Years.create({ name: "2eme cycle supérieur - ISI", email: "etudiant4.isi@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year5.id })
                await Semesters.create({ name: "Semestre 2", yearId: year5.id })
                const year6 = await Years.create({ name: "3eme cycle supérieur - SIW", email: "etudiant5.siw@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year6.id })
                await Semesters.create({ name: "Semestre 2", yearId: year6.id })
                const year7 = await Years.create({ name: "3eme cycle supérieur - ISI", email: "etudiant5.isi@esi-sba.dz" })
                await Semesters.create({ name: "Semestre 1", yearId: year7.id })
                await Semesters.create({ name: "Semestre 2", yearId: year7.id })
                const requirement = await Requirements.create({ name: "Salle TD" })
                const requirement2 = await Requirements.create({ name: "Amphi" })
                const requirement3 = await Requirements.create({ name: "Salle TP" })
                const module_ = await Modules.create({ name: "Anaylse 1", coefficient: 5, examenH: 2, examenMin: 30, semesterId: 1 })
                await Cours.create({ name: "Cours - Anaylse 1", hour: 2, min: 0, moduleId: module_.id, requirementId: requirement2.id })
                await TDP.create({ name: "TD - Anaylse 1", hour: 2, min: 0, moduleId: module_.id, requirementId: requirement.id })
                const module2_ = await Modules.create({ name: "Algorithmique 1", coefficient: 5, examenH: 2, examenMin: 30, semesterId: 1 })
                await Cours.create({ name: "Cours - Algorithmique 1", hour: 2, min: 0, moduleId: module2_.id, requirementId: requirement2.id })
                await TDP.create({ name: "TD - Algorithmique 1", hour: 2, min: 0, moduleId: module2_.id, requirementId: requirement.id })
                await TDP.create({ name: "TP - Algorithmique 1", hour: 2, min: 0, moduleId: module2_.id, requirementId: requirement3.id })
                const section1 = await Sections.create({ name: "Section A", yearId: year1.id })
                const section2 = await Sections.create({ name: "Section B", yearId: year1.id })
                await Groups.create({ name: "Groupe 1", sectionId: section1.id })
                await Groups.create({ name: "Groupe 2", sectionId: section1.id })
                await Groups.create({ name: "Groupe 3", sectionId: section1.id })
                await Groups.create({ name: "Groupe 4", sectionId: section1.id })
                await Groups.create({ name: "Groupe 5", sectionId: section2.id })
                await Groups.create({ name: "Groupe 6", sectionId: section2.id })
                await Groups.create({ name: "Groupe 7", sectionId: section2.id })
                await Groups.create({ name: "Groupe 8", sectionId: section2.id })
                await SubRequirements.create({ name: "Salle TD 01", requirementId: requirement.id })
                await SubRequirements.create({ name: "Salle TD 02", requirementId: requirement.id })
                await SubRequirements.create({ name: "Salle TD 03", requirementId: requirement.id })
                await SubRequirements.create({ name: "Salle TD 04", requirementId: requirement.id })
                await SubRequirements.create({ name: "Salle TD 05", requirementId: requirement.id })
                await SubRequirements.create({ name: "Salle TD 06", requirementId: requirement.id })
                await SubRequirements.create({ name: "Salle TD 07", requirementId: requirement.id })
                await SubRequirements.create({ name: "Amphi A", requirementId: requirement2.id })
                await SubRequirements.create({ name: "Amphi B", requirementId: requirement2.id })
                await SubRequirements.create({ name: "Amphi C", requirementId: requirement2.id })
                await SubRequirements.create({ name: "Amphi D", requirementId: requirement2.id })
                await SubRequirements.create({ name: "Amphi E", requirementId: requirement2.id })
                await SubRequirements.create({ name: "Salle TP 01", requirementId: requirement3.id })
                await SubRequirements.create({ name: "Salle TP 02", requirementId: requirement3.id })
                await SubRequirements.create({ name: "Salle TP 03", requirementId: requirement3.id })
                await SubRequirements.create({ name: "Salle TP 04", requirementId: requirement3.id })
                await SubRequirements.create({ name: "Salle TP 05", requirementId: requirement3.id })
            }

        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });


module.exports = { Users, Years, Semesters, Modules, Cours, Requirements, Responsables, TDP, ResponsablesTDP, Sections, Groups, SubRequirements }