const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const connection = require("./db");
module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      connection.query(
        `SELECT * FROM userinfo WHERE username = "${username}"`,
        function (err, results) {
          if (err) {
            console.log(err);
          }
          if (results.length === 0) {
            return done(null, false);
          }
          const newUser = results[0];
          bcrypt.compare(password, newUser.password, (err, result) => {
            console.log(newUser);
            if (err) throw err;
            if (result === true) {
              return done(null, newUser);
            } else {
              return done(null, false);
            }
          });
        }
      );
    })
  );

  passport.serializeUser((user, cb) => {
    console.log(user.id);
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    console.log(id, "dcb");
    connection.query(
      `SELECT * FROM userinfo WHERE id = "${id}"`,
      function (err, results) {
        if (err) throw err;
        cb(err, results[0]);
        console.log(results);
      }
    );
  });
};
