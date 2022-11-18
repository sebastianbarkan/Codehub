const mysql = require("mysql2");

module.exports = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sqlrootpass2",
  port: 3306,
  database: "codesnippetdb",
});
