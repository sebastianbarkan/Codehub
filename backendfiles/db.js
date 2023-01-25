const mysql = require("mysql2");

module.exports = mysql.createPool({
  host:
    process.env.NODE_ENV === "development"
      ? process.env.DB_HOST
      : process.env.PROD_DB_HOST,
  user:
    process.env.NODE_ENV === "development"
      ? process.env.DB_USER
      : process.env.PROD_DB_USER,
  password:
    process.env.NODE_ENV === "development"
      ? process.env.DB_PASSWORD
      : process.env.PROD_DB_PASSWORD,
  port:
    process.env.NODE_ENV === "development"
      ? process.env.DB_PORT
      : process.env.PROD_DB_PORT,
  database:
    process.env.NODE_ENV === "development"
      ? process.env.DB_NAME
      : process.env.PROD_DB_NAME,
});
