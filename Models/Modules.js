module.exports = (sequelize, type) => {

    return sequelize.define('modules', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name :type.STRING,
        complex :type.INTEGER,
    })
    
};



