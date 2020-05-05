const mysql = require('mysql');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'v3test2'
});

module.exports = connection;