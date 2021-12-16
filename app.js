var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();

app.use(cors());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(function (req, res, next) {
  res.locals.connection = mysql.createConnection({
    host: "localhost",
    user: "sqluser",
    password: "password",
    database: "test",
  });
  res.locals.connection.connect();
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.post("/login", urlencodedParser, function (req, res, next) {
  console.log(req.body.username);
    var sql =
      "Select *  from `users` where email='" +
      req.body.username +
      "' And password ='" +
      req.body.password+
      "'";
    res.locals.connection.query(sql, function (error, results, fields) {
      if (error) throw error;
      if (results.length>0) {
        res.send({
          token: "test123",
        });
      }
      else res.send({
        token: "",
      });
     });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
