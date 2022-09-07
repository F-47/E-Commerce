const { default: mongoose } = require('mongoose')

mongoose = require('mongoose')
productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('product', productSchema)
