let express = require('express')
let router = express.Router()
let User = require('../model/user')
let bcrypt = require('bcryptjs')
let passport = require('passport')


router.get("/Dashboard", (req, res) => {
  res.render("DashBoard", { title: "Home" });
});

router.get("/",(req,res)=>{
    res.redirect("/home")
})

router.get("/home", (req, res) => {
  res.render("HomePage", { title: "Home" });
});

router.get("/home/login", (req, res) => {
  res.render("Login", { title: "Login" });
});

// Login handler 
router.post('/home/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect: '/Dashboard',
        failureRedirect: '/home/login', 
        failureFlash:true
    })(req,res,next)
})

router.get("/home/register", (req, res) => {
  res.render("Register", { title: "Register" });
});

router.post("/home/register", (req, res) => {
   let { name, email, password, password2 } = req.body;
    let errors = []
    
    //check that all fields are filled
    if (!name || !email || !password || !password2) {
        errors.push({msg:"Please fill out all the fields"})
    }

    //check that both passwords matches
    if (password !== password2) {
        errors.push({msg:"Passwords don't match"})
    }

    //check that password is at least 6 characters long
    if (password.length < 6) {
        errors.push({msg:'Passowrd should be at least 6 characters'})
    }

    //check if their is any errors 
    if (errors.length > 0) {
        res.render('register',{errors,name,email,password,password2,title: "Register"})
    } else {
        User.findOne({ email: email })
            .then(user => {
                errors.push({msg:"Email is already registered"})
                if (user) {
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        title: "Register"
                    })
                } else {
                    // if user doesn't exist create new one
                    let newUser = new User({name,email,password})
                    //crypt password
                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(newUser.password, salt, (err,hash) => {
                            if (err) throw err
                            //password is hashed 
                            newUser.password = hash
                            //SaveUser
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg','You are now registered and can Login ')
                                    res.redirect('/home/login')
                                })
                                .catch(err=>console.log(err))
                        })
                    })
                }
            })
    }
});



router.get('/productDetails', (req, res) => {
    res.render('productDetails', { title: 'Product' })
})



module.exports = router