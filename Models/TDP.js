module.exports = (sequelize, type) => {

    return sequelize.define('tdp', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        name :type.STRING,
        hour : {
            type : type.INTEGER,
            defaultValue: 0
        },
        min : {
            type : type.INTEGER,
            defaultValue: 0
        },
    })
 
};
