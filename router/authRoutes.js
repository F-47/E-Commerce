const router = require('express').Router()
const { isAuth } = require('../helpers/authentication')

router.get('/home', isAuth, (req,res,next) =>{
    res.render('dashboard', {title: 'dashboard page'})
})

module.exports = router