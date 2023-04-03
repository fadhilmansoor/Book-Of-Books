const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,

    },
    email:{
      type:String,
    
    },

    status:{
        type:Boolean,
        default:true
    
    },
    address:[
      {
         address1:{
             type:String,
             required: true,
         },
         count: {
          type: Number,
          required: true,
          default: 1
        }
      }
   ],
   
    imageurl:{
      type:String
    },
    country:{
      type:String
    },
    city:{
      type:String
    },
    state:{
      type:String
    },

    cart: {
        items: [{
          product_id: {
            type: String,
            ref: 'addproducts'
          },
          qty: {
            type: Number
          },
          product_idtotal:{
            type:Number
          }
        }
        ],
        totalPrice: {
          type: Number,
          default:0
        }
    },
    wishlist: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addproducts',
        required: true,
      }
    }],
    wallet:{
      type:Number,
      default:0
    }
})
module.exports = mongoose.model('users',usersSchema);