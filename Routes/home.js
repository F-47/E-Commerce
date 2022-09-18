let express = require('express')
let router = express.Router()
let User = require('../model/user')
let Product = require('../model/product')
let bcrypt = require('bcryptjs')
let passport = require('passport')
const productController = require('../controller/productController')
const userController = require('../controller/userController')
let { ensureAuthenticated } = require('../config/auth')

router.get("/", userController.getHome)

router.get("/home", productController.getAllProduct);

router.get("/home/login", userController.getLogin);

// Login handler 
router.post('/home/login', userController.postlogin)

router.get("/home/register", userController.getRegister);

router.post("/home/register", userController.postRegister);

router.get("/home/profile", ensureAuthenticated, userController.getProfile);

router.delete('/user/:id', userController.deleteUser)

router.get('/home/logout', userController.logoutUser);

router.get('/productDetails', (req, res) => {
    res.render('productDetails', {
        title: 'Product',
        user: req.user
    })
})

router.post('/addProduct', productController.addProduct)

router.get('/productDetails/:id', productController.getDetails)

router.get('/home/laptops', productController.getLaptops)
module.exports = router