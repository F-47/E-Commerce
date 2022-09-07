const userRouter = require('express').Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
userRouter.get('/', (req, res) => {
    res.redirect('/home')
})
userRouter.get('/home', (req, res) => {
    res.render('HomePage', { title: 'Home' })
})
userRouter.post('/home', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    req.checkBody('name', 'username is required').notEmpty()
    req.checkBody('email', 'email is not valid').isEmail()
    req.checkBody('password', 'password is required.').notEmpty().isLength({ min: 5 }).withMessage('password must be great than 5 chars.')
    const errors = req.validationErrors()
console.log(errors)
    let newUser
    try {
        if (errors) {
            req.flash('error', errors)
            res.render('/HomePage', { title: 'Home page', errors: errors })
        } else {
            newUser = new User({
                email,
                password, name
            })
            await bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) { console.log(err) }
                    newUser.password = hash
                    newUser.save((err) => {
                        if (err) {
                            console.log(err)
                            return;
                        } else {
                            req.flash('sucess', 'user saved to database')
                            res.redirect('/home')
                        }
                    })
                })
            })
        }
    } catch (err) {
        console.log(err)
    }
    if (!newUser) {
        return res.status(500).json({ message: 'unable To add' })
    } return res.status(201).render('HomePage', { title: 'home' })
})
userRouter.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})

module.exports = userRouter
