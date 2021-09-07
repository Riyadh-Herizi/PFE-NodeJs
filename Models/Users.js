
module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname :type.STRING,
        email :type.STRING,
        lastname :type.STRING,
        username: type.STRING,
        password : type.STRING,
        role: type.INTEGER,
        type : type.STRING,
        refreshtoken : type.TEXT
    })
};  
