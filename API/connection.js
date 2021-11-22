const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MatferDreal61",
  database: "dreal",
});

module.exports = connection;