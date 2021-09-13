
module.exports = (sequelize, type) => {
    return sequelize.define('positionsexams', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },     
        date : {
            type : type.STRING,
           
        },
        prof : {
            type : type.STRING,
           
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
