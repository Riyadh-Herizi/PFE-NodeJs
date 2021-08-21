module.exports = (sequelize, type) => {

    return sequelize.define('modules', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        name :type.STRING,
        complex : {
            type : type.INTEGER,
            defaultValue: 0
        },
        examenH : {
            type : type.INTEGER,
            defaultValue: 0
        },
        examenMin : {
            type : type.INTEGER,
            defaultValue: 0
        },
    })
    
};



