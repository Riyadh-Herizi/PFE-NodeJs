module.exports = (sequelize, type) => {

    return sequelize.define('requirements', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        
        name :type.STRING,
    
        nombre : {
            type : type.INTEGER,
            defaultValue: 0
        },
    })
 
};