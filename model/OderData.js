const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  delveryAddress: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  product: [{
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'addproducts',
      required: true
    },
    quantity: {
      type: Number,
    }
  }],
  total: {
    type: Number
  },
  paymentType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'confirmed'
  },
  coupan: {
    type: String,
  }
})

module.exports = mongoose.model('orderdata', orderSchema)