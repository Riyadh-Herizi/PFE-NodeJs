module.exports = (sequelize, type) => {

    return sequelize.define('repsonsables', {
        
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        
    })
 
};