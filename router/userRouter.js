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
    let { name, email, password, repassword } = req.body
    let errors = [];
    if (!name || !email || !password || !repassword) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password != repassword) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.send(errors)
        // res.render('HomePage', {
        //     title: 'Home',
        //     errors,
        //     name,
        //     email,
        //     password,
        //     repassword
        // });
    }
    console.log(errors)
    //     let newUser
    //     try {
    //         newUser = new User({
    //             email,
    //             password, name
    //         })
    //         await bcrypt.genSalt(10, (err, salt) => {
    //             bcrypt.hash(newUser.password, salt, (err, hash) => {
    //                 if (err) { console.log(err) }
    //                 newUser.password = hash
    //                 newUser.save((err) => {
    //                     if (err) {
    //                         console.log(err)
    //                         return;
    //                     } else {
    //                         res.redirect('/home')
    //                     }
    //                 })
    //             })
    //         })
    //     } catch (err) {
    //         console.log(err)
    //     }
    //     if (!newUser) {
    //         return res.status(500).json({ message: 'unable To add' })
    //     } return res.status(201).render('HomePage', { title: 'home' })
    // })
    userRouter.use((req, res) => {
        res.status(404).render('404', { title: '404' })
    })
})

module.exports = userRouter
