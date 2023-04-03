const mongoose = require ('mongoose')

const bannerSchema = mongoose.Schema({
    image:{
        type:Array,
        requiref:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Banner',bannerSchema);