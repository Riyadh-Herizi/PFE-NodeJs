module.exports = (sequelize, type) => {

    return sequelize.define('repsonsablestdp', {
        
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        
    })
 
};