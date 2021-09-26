module.exports = (sequelize, type) => {

    return sequelize.define('occupations', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },    
        type : {
            type : type.INTEGER,
            defaultValue: -1
        },        
        day : {
            type : type.INTEGER,
            defaultValue: -1
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