const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'filmfanatics'
});

connection.connect((err) => {
    if (err) {
        throw err;
    } 
    else {
        console.log('Connected to the database succesfully!');
    }
});


module.exports = connection;