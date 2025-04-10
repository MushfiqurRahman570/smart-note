const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sys123',
  database: 'smartnotes_db' // Create this database in MySQL
});

connection.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected!');
});

module.exports = connection;
