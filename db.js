const Sequelize = require('sequelize')

const db = new Sequelize('push_not_test', 'root', 'forever', {
    dialect: 'mysql',
    host: 'localhost',
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
});

const User = db.define('User', {
    name: Sequelize.STRING,
    token: Sequelize.STRING,
    endpoint: Sequelize.STRING,
    p256: Sequelize.STRING,
    auth: Sequelize.STRING
});


module.exports = {
    db,
    User
};