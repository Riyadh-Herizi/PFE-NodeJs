module.exports = (sequelize, type) => {

    return sequelize.define('responsablestdp', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        
    })
 
};