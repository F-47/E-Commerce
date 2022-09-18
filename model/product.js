const mongoose = require('mongoose')

productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  price: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('product', productSchema)