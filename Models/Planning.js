const  Sequelize = require("sequelize");
module.exports = (sequelize, type) => {

    return sequelize.define('plannings', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        name :type.STRING,
        auto :{
            type: type.INTEGER, 
            defaultValue: 0
        }, 
        statut :{
            type: type.INTEGER, 
            defaultValue: 0
        }, 
        
        

       
    })
 
};
