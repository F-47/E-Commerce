let express = require('express')
let router = express.Router()
let User = require('../model/user')
let bcrypt = require('bcryptjs')
let passport = require('passport')
let { ensureAuthenticated } = require('../config/auth')

exports.getHome = (req, res) => {
  res.redirect("/home")
}
exports.getLogin = (req, res) => {
  res.render("Login", { user: req.user, title: "Login" });
}
exports.postlogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/home/login',
    failureFlash: true
  })(req, res, next)
}
exports.getRegister = (req, res) => {
  res.render("Register", { user: req.user, title: "Register" });
}
exports.postRegister = (req, res) => {
  let { firstname, lastname, email, password, password2 } = req.body;
  let errors = []

  //check that all fields are filled
  if (!firstname || !lastname || !email || !password || !password2) {
    errors.push({ msg: "Please fill out all the fields" })
  }

  //check that both passwords matches
  if (password !== password2) {
    errors.push({ msg: "Passwords don't match" })
  }

  //check that password is at least 6 characters long
  if (password.length < 6) {
    errors.push({ msg: 'Passowrd should be at least 6 characters' })
  }

  //check if their is any errors 
  if (errors.length > 0) {
    res.render('register', { errors, firstname, lastname, email, password, password2, title: "Register" })
  } else {
    User.findOne({ email: email })
      .then(user => {
        errors.push({ msg: "Email is already registered" })
        if (user) {
          res.render('register', {
            user: req.user,
            errors,
            firstname,
            lastname,
            email,
            password,
            password2,
            title: "Register"
          })
        } else {
          // if user doesn't exist create new one
          let newUser = new User({ firstname, lastname, email, password })
          //crypt password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              //password is hashed 
              newUser.password = hash
              //SaveUser
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can Login ')
                  res.redirect('/home/login')
                })
                .catch(err => console.log(err))
            })
          })
        }
      })
  }
}
exports.getProfile = (req, res) => {
  res.render("Profile", { user: req.user, title: "Home" });
}
exports.deleteUser = (req, res) => {
  let id = req.params.id;
  User.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: '/home' })
    })
    .catch(err => {
      console.log(err)
    })
}
exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    res.redirect('/home');
  });
}