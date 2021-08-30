const  Sequelize = require("sequelize");
module.exports = (sequelize, type) => {

    return sequelize.define('plannings', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        name :type.STRING,
        start :Sequelize.DATE,
        end :Sequelize.DATE
        

       
    })
 
};
