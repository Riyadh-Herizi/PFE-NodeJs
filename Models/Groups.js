module.exports = (sequelize, type) => {

    return sequelize.define('groups', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        name :type.STRING
       
    })
 
};
