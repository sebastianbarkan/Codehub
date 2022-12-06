const mysql = require("mysql2");

module.exports = mysql.createPool({
  host: "database-1.cd8jyulcpysq.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "8cjaUsb7",
  port: 3306,
  database: "codesnippetdb",
});
