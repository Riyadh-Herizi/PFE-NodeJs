
module.exports = (sequelize, type) => {
    return sequelize.define('positionscours', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        startH : {
            type : type.INTEGER,
            defaultValue: 0
        },
        endH : {
            type : type.INTEGER,
            defaultValue: 0
        },
        startMin : {
            type : type.INTEGER,
            defaultValue: 0
        },
        endMin : {
            type : type.INTEGER,
            defaultValue: 0
        },
       
        
       
    })
 
};
