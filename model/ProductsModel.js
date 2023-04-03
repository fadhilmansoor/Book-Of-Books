const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:Array,
        required:true
    },
    category:{
    type: mongoose.Schema.Types.ObjectId,
     ref:"Category",
      required:true
    
    },
    stock:{
        type:Number,
    },
    Price:{
        type:Number,
        required:true,
    },
    About:{
        type:String,
        required:true 
    },
    offer:{
        type:Number
    }
 
})

module.exports = mongoose.model('addproducts',ProductSchema);
