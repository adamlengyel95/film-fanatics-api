const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bacbdce0cadc1a',
    password: 'fbd6f069',
    database: 'heroku_6647cfa7bfae13e'
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