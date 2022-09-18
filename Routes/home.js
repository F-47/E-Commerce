let express = require('express')
let router = express.Router()
let User = require('../model/user')
let Product = require('../model/product')
let bcrypt = require('bcryptjs')
let passport = require('passport')
let { ensureAuthenticated } = require('../config/auth')

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", async (req, res) => {

    let products;
    try {
        products = await Product.find();
    } catch (err) {
        console.log(err)
    }
    if (!products) {
        return res.status(404).json({ message: "No products found !" })
    }
    return res.status(201).render('HomePage',
        {
            title: 'Products',
            user: req.user,
            arr: products
        })
});

router.get("/home/login", (req, res) => {
    res.render("Login", { user: req.user, title: "Login" });
});

// Login handler 
router.post('/home/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/home/login',
        failureFlash: true
    })(req, res, next)
})

router.get("/home/register", (req, res) => {
    res.render("Register", { user: req.user, title: "Register" });
});

router.post("/home/register", (req, res) => {
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
});

router.get("/home/profile", ensureAuthenticated, (req, res) => {
    res.render("Profile", { user: req.user, title: "Home" });
});

router.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/home' })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/home/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        res.redirect('/home');
    });
});

router.get('/productDetails', (req, res) => {
    res.render('productDetails', {
        title: 'Product',
        user: req.user
    })
})
// router.get('/home', async (req, res, next) => {
//     let products;
//     try {
//         products = await Product.find();
//     } catch (err) {
//         console.log(err)
//     }
//     if (!products) {
//         return res.status(404).json({ message: "No products found !" })
//     }
//     return res.status(201).render('HomePage',
//         {
//             title: 'Products',
//             user: req.user,
//             arr: products
//         })
// })

router.post('/addProduct', async (req, res, next) => {
    const name = req.body.name;
    const category = req.body.category
    const image = req.body.image;
    const price = req.body.price;
    try {
        let product = new Product({
            name: name,
            category: category,
            price: price,
            image: image
        })
        await product.save()
    } catch (err) {
        console.log(err)
    }
    if (!product) {
        return res.status(500).json({ message: 'unable To add' })
    } return res.status(201).json({ product })
})

router.get('/productDetails/:id', async (req, res, next) => {
    const id = req.params.id
    let product;
    try {
        product = await product.findOne({ _id: req.params.id })
    }

    catch (err) {
        console.log(err)
    }
    if (!product) {
        return res.status(500).json({ message: 'Not product found' })
    } return res.status(201).json({ product })
})

router.get('/home/laptops', async (req, res) => {

    let products;
    try {

        products = await Product.find({ "category": "Laptop" })

    } catch (err) {
        console.log(err)
    }
    if (!products) {
        return res.status(404).json({ message: "No products found !" })
    }
    return res.status(201).render('laptops',
        {
            title: 'Products',
            user: req.user,
            arr: products
        })


})
module.exports = router