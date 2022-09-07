const router = require('express').Router()


// router.get('/home', (req, res) => {
//     res.render('HomePage', { title: 'Home' })

// })

router.get('/productDetails', (req, res) => {
    res.render('productDetails', { title: 'Product' })
})

// router.get('/login', (req, res, next) => {
//     res.render('index',{title:"login"})
// })
// router.post('/home', (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     res.render('HomePage', { title: 'Home' })
//     console.log(email, password)
// })

// router.use((req, res) => {
//     res.status(404).render('404', { title: '404' })
// })

module.exports = router