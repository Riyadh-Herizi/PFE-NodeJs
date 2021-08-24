module.exports = (sequelize, type) => {

    return sequelize.define('subrequirements', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        
        name :type.STRING,
    
    
    })
 
};