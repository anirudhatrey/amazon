var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");

var router = express.Router();

// create application/json parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.locals.connection.query(
    "SELECT * from users",
    function (error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    }
  );
});

router.post("/", urlencodedParser, function (req, res, next) {
  console.log(req.body.userName);
  console.log(req.body.Email);
  console.log(req.body.Password);
  console.log(req.body.Pnum);
  res.locals.connection.connect(function (err) {
    if (err) throw err;
    console.log("connected");
    var sql =
      "INSERT INTO `users`(`Name`,`email`, `password`,`phone`) VALUES ('" +
      req.body.userName +
      "','" +
      req.body.Email +
      "','" +
      req.body.Password +
      "','" +
      req.body.Pnum +
      "')";
    res.locals.connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created");
    });
  });
  res.render("index", { title: "Express" });
});
module.exports = router;
