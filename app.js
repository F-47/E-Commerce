let express = require('express')
const { port, database } = require('./config/config')
const mongoose=require('mongoose')
let flash = require("connect-flash")
let session = require("express-session")
let passport = require('passport')

let app = express()

//passport config
require("./config/passport")(passport)

//create mongodb
mongoose.connect(database,{ useNewUrlParser: true })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

app.set("view engine", "ejs")

//Middleware and Static files
app.use(express.static('public')) // we can access any file in the public folder
app.use(express.urlencoded({ extended: false })); // so we can access the data coming from the input value

// Express Session Middleware 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect-flash middleware 
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Routes
app.use('/',require('./Routes/home'))

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(port, () => {
    console.log(`conected with port ${port}`)
})


