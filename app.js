require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
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

    User.findOne({ email: email }, function (err, user) {
      if (err) console.log(err);
      else if (user) {
        bcrypt.compare(pass, user.password, function (err, result) {
          if (err) console.log(err);
          else if (result) {
            res.render("secrets");
          } else res.render("login");
        });
      } else res.render("register");
    });
  });
app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) console.log(err);
      else {
        const newuser = {
          email: req.body.username,
          password: hash,
        };
        User.findOne({ email: newuser.email }, function (err, user) {
          if (err) console.log(err);
          else if (user) res.render("login");
          else {
            const newUser = new User(newuser);
            newUser.save(function (err) {
              if (err) console.log(err);
              else res.render("secrets");
            });
          }
        });
      }
    });
  });
