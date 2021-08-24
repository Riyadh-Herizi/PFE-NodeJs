module.exports = (sequelize, type) => {

    return sequelize.define('sections', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        name :type.STRING
       
    })
 
};