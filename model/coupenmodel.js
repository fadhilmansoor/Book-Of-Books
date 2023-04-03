const mongoose = require('mongoose');

const coupenData = new mongoose.Schema({
    code:{
        type:String
    },
    discount:{
        type: Number,
        min: 0,
        max:100
    },
    expirationDate:{
        type:Date,
        required:true,
    },
    maxDiscount:{
        type:Number,
        required:true
    },
    minpurachaseAmount:{
        type:Number,
        required:true
    },
    parcentageOff:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    userused:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
})

module.exports = mongoose.model('coupen',coupenData)