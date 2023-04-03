const users = require('../model/userDataModel')
const products = require('../model/ProductsModel')
const category = require('../model/categoryModel')
const Order = require('../model/OderData')
const session = require('express-session')
const { name } = require('ejs')

// SHOP RENTERING
const shop = async (req,res) => {
     try {
     let id = null
     const pro = await products.find({})
     const cat = await category.find({})
    if (req.session.userid) {
     const udata = await users.findOne({ _id: req.session.userid }).populate('cart.items.product_id')
     const wishcount = await users.findOne({_id:req.session.userid}).populate('wishlist.product')
     if (pro) {
         res.render('Shop', { pro, cat, udata, wishcount})
     }
 } else {
     const udata = null
      const wishcount = null
     res.render('Shop', { pro, cat, udata, wishcount})
 }
     } catch (error) {
         console.log(error)
     }
}

// BLOG RENTERING
const blog = async (req,res) => {
     try {
          let id = null
          const pro = await products.find({})
          const cat = await category.find({})
          if (req.session.userid) {
              const udata = await users.findOne({ _id: req.session.userid }).populate('cart.items.product_id')
              const wishcount = await users.findOne({_id:req.session.userid}).populate('wishlist.product')
              if (pro) {
                  res.render('Blog', { pro, cat, udata,wishcount})
              }
          } else {
              const udata = null
              const wishcount = null 
              res.render('Blog' , { pro, cat, udata,wishcount})
          } 
     } catch (error) {
         console.log(error)
     }
}
    

// ABOUT RENTERING
const About = async (req,res) => {
      try {
          let id = null
          const pro = await products.find({})
          const cat = await category.find({})
          if (req.session.userid) {
              const udata = await users.findOne({ _id: req.session.userid }).populate('cart.items.product_id')
              const wishcount = await users.findOne({_id:req.session.userid}).populate('wishlist.product')
              if (pro) {
                  res.render('About', { pro, cat, udata,wishcount})
              }
          } else {
              const udata = null
              const wishcount = null
              res.render('About' , { pro, cat, udata, wishcount})
          }
      } catch (error) {
          console.log(error)
      }
     }

 const Exporting = module.exports = {
     shop,
     blog,
     About
}
