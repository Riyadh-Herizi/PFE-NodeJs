const  Sequelize = require("sequelize");
module.exports = (sequelize, type) => {

    return sequelize.define('examsplannings', {
        

        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        name :type.STRING,
        emd :type.STRING,
        auto :{
            type: type.INTEGER, 
            defaultValue: 0
        }, 
       
        
        

       
    })
 
};
