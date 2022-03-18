const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const app = express();
const PORT = 2403;

app.use(express.static(path.join("./public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://127.0.0.1:27017/userdb");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.listen(PORT);

app.route("/").get(function (req, res) {
  res.render("home");
});
app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    const email = req.body.username;
    const pass = req.body.password;
    User.findOne({ email: email, password: pass }, function (err, user) {
      if (err) console.log(err);
      else if (user) res.render("secrets");
      else res.render("login");
    });
  });
app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    const user = {
      email: req.body.username,
      password: req.body.password,
    };
    const newUser = new User(user);
    newUser.save(function (err) {
      if (err) console.log(err);
      else res.render("secrets");
    });
  });
