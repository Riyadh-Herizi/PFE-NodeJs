module.exports = (sequelize, type) => {
    return sequelize.define('semesters', {
       
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name :type.STRING,
        
    })
};
