module.exports = (sequelize, type) => {

    return sequelize.define('responsables', {
        
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        
    })
 
};