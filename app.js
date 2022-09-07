let express = require('express')
const { port, database } = require('./config/config')
const router = require("./router/productRouter")
const userRouter = require('./router/userRouter')
const bodyParser = require('body-parser')
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const flash = require('flash')
const expressValidator = require('express-validator');
const passport = require('passport')
let app = express()


mongoose
    .connect(database)
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

app.set("view engine", "ejs")
//middleware and  static files
app.use(express.static('public')) // we can access any file in the public folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router)
app.use('/', userRouter)

app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res)
    next()
})



require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})


const dashboardRouter = require('./router/authRoutes')

app.use(expressValidator())

app.use(flash())

app.listen(port, () => {
    console.log(`conected with port ${port}`)
})


