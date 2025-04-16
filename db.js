const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "1234", // Your MySQL password
  database: "raylush_db" // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
