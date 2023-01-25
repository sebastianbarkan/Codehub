const mysql = require("mysql2");
require("dotenv").config();

module.exports = mysql.createPool({
  host:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_DB_HOST
      : process.env.DB_HOST,
  user:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_DB_USER
      : process.env.DB_USER,
  password:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_DB_PASSWORD
      : process.env.DB_PASSWORD,
  port:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_DB_PORT
      : process.env.DB_PORT,
  database:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_DB_NAME
      : process.env.DB_NAME,
});
