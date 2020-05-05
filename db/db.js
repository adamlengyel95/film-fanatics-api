const mysql = require('mysql');

const connection = mysql.createPool({
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'b135a4706f2da7',
    password: 'eeb81547',
    database: 'heroku_8c6087eb51aad31'
});

module.exports = connection;