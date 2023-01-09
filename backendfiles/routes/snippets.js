const express = require("express");
const router = express.Router();
const connection = require("../db");

router.post("/create", (req, res) => {
  const snippet = req.body[0];
  const code = JSON.stringify(req.body[1]);
  let encode = Buffer.from(code).toString("base64");
  try {
    connection.query(
      `INSERT INTO snippets (user_id, title, created_at, language, code_snippet, public, description, author) VALUES (${snippet.user_id}, "${snippet.title}", "${snippet.created_at}", "${snippet.language}", "${encode}", ${snippet.public}, "${snippet.description}", "${snippet.author}")`,
      function (err, results) {
        if (err) {
          console.log(err);
        }
        res.end("\n");
      }
    );
  } catch (err) {
    console.log(err);
  }
});

router.get("/getSnippets", (req, res) => {
  connection.query(
    `SELECT * FROM snippets WHERE user_id = ${req.query.id};`,
    function (err, results) {
      res.send(results);
    }
  );
});

router.get("/getAllSnippets", (req, res) => {
  const userId = req.query.userId;
  try {
    connection.query(`SELECT * FROM snippets;`, function (err, results) {
      let publicSnippets = results.filter((e, i) => {
        if (e.public === 1) {
          return e;
        } else if (e.public === 0 && e.user_Id === userId) {
          return e;
        }
      });
      res.send(publicSnippets);
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.delete("/deleteSnippet", (req, res) => {
  connection.query(
    `DELETE FROM snippets WHERE id=${req.body.id};`,
    function (err, results) {
      res.send(results);
    }
  );
});

router.post("/likeSnippet", (req, res) => {
  const likes = JSON.stringify(req.body[1]);
  let encode = Buffer.from(likes).toString("base64");
  try {
    connection.query(
      `UPDATE snippets SET likes = likes + 1 WHERE id=${req.body[0].id};`,
      function (err, results) {
        updateUserLikes();
      }
    );
  } catch (err) {
    console.log(err);
  }
  const updateUserLikes = () => {
    try {
      connection.query(
        `UPDATE userinfo SET liked ="${encode}" WHERE id=${req.body[2]};`,
        function (err, results) {
          getUserLikes();
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getUserLikes = () => {
    try {
      connection.query(
        `SELECT liked FROM userinfo WHERE id=${req.body[2]};`,
        function (err, results) {
          res.send(results);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
});

router.post("/saveSnippet", (req, res) => {
  const saves = JSON.stringify(req.body[0]);
  let encode = Buffer.from(saves).toString("base64");

  try {
    connection.query(
      `UPDATE userinfo SET saved ="${encode}" WHERE id=${req.body[1]};`,
      function (err, results, status) {
        getSaved();
      }
    );
  } catch (err) {
    console.log(err, "SAVES");
  }

  const getSaved = () => {
    try {
      connection.query(
        `SELECT saved FROM userinfo WHERE id=${req.body[1]};`,
        function (err, results) {
          res.send(results);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
});

router.post("/getSaved", (req, res) => {
  try {
    connection.query(
      `SELECT saved FROM userinfo WHERE id=${req.body[0]};`,
      function (err, results) {
        res.send(results);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

router.post("/updateSnippet", (req, res) => {
  const snippet = JSON.stringify(req.body[1]);
  let encode = Buffer.from(snippet).toString("base64");
  try {
    connection.query(
      `UPDATE snippets SET code_snippet="${encode}", title="${req.body[2]}" WHERE id=${req.body[0]};`,
      function (err, results) {
        fetchUpdates();
      }
    );
  } catch (err) {
    console.log(err);
  }

  const fetchUpdates = () => {
    try {
      connection.query(
        `SELECT code_snippet, title FROM snippets WHERE id=${req.body[0]};`,
        function (err, results) {
          res.send(results);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
});

router.post("/removeFromSaved", (req, res) => {
  const saved = JSON.stringify(req.body[1]);
  let encode = Buffer.from(saved).toString("base64");
  try {
    connection.query(
      `UPDATE userinfo SET saved ="${encode}" WHERE id=${req.body[0]};`,
      function (err, results) {
        getSaved();
      }
    );
  } catch (err) {
    console.log(err);
  }

  const getSaved = () => {
    try {
      connection.query(
        `SELECT saved FROM userinfo WHERE id=${req.body[0]};`,
        function (err, results) {
          res.send(results);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
});

module.exports = router;
