const userdata = require('../model/userDataModel')
const prodata = require('../model/ProductsModel')
const { name } = require('ejs')
const products = require('../model/ProductsModel')
const category = require('../model/categoryModel')
const coupondata = require('../model/coupenmodel')
const session = require('express-session')
const uuid = require('uuid')
//CART VIEW

const cartview = async (req, res) => {
     try {
          if (req.session.userid) {
               const userid = req.session.userid
               const pro = await products.find({})
               const cat = await category.find({})
               const udata = await userdata.findOne({ _id: userid }).populate('cart.items.product_id')
               const wishcount = await userdata.findOne({_id:req.session.userid}).populate('wishlist.product')
               res.render('Cart', { userdata: udata, wishcount})
          } else {
               res.redirect('/login')
          }
     } catch (error) {
          console.log(error.message)
     }
}

// EDITTING CART
const cart = async (req, res) => {
     console.log(req.body);
     const userid = req.session.userid
     const prodatas = req.body.productid
     const pro = await prodata.findOne({ _id: prodatas })
     console.log(pro);
     const carts = await userdata.findOne({ _id: userid })
     if (carts.cart.items.length < 1) {
          userdata.updateOne({ _id: userid },
               { $push: { "cart.items": { product_id: prodatas, qty: 1, product_idtotal: pro.Price } }, $inc: { 'cart.totalPrice': pro.Price } }).then((data) => {
                    console.log(data);
               }).catch((err) => {
                    console.log(err);
               })
          res.json({ success: true })
     } else {
          const userdatas = await userdata.findOne({ _id: userid, 'cart.items.product_id': prodatas }).select({ 'cart.items': 1 })
          if (userdatas && userdatas.cart.items.length >= 1) {
               const news = await userdata.updateOne({ _id: userid, 'cart.items.product_id': prodatas }, {
                    $inc: { "cart.items.$.qty": 1, 'cart.items.$.product_idtotal': pro.Price, 'cart.totalPrice': pro.Price }
               }, { new: true })
               return
          } else {
               await userdata.updateOne({ _id: userid }, {
                    $push: { 'cart.items': { product_id: prodatas, qty: 1, product_idtotal: pro.Price } }, $inc: { 'cart.totalPrice': pro.Price }
               })
               return
          }
     }

}

//QUANTITY
const changeqty = async (req, res) => {
     try {
          console.log('cahnge qty route');
          if (req.session.userid) {
               const proid = req.body.product
               const count = req.body.count
               const Price = req.body.Price
               const changequ = await userdata.updateOne({ _id: req.session.userid, "cart.items.product_id": proid }, { $inc: { "cart.items.$.qty": count } })
               const quan = await userdata.findOne({ _id: req.session.userid, "cart.items.product_id": proid }, { _id: 0, "cart.items.qty.$": 1 })
               const multiquan = quan.cart.items[0].qty
               const pricequan = Price * multiquan
               console.log(pricequan);
               console.log(Price);
               await userdata.updateOne({ _id: req.session.userid, 'cart.items.product_id': proid }, { $set: { "cart.items.$.product_idtotal": pricequan } })
               const carts = await userdata.findOne({ _id: req.session.userid })

//TOTALPRICE
const updtotal = await userdata.findOneAndUpdate({ _id: req.session.userid, 'cart.items.product_id': proid }, { $inc: { 'cart.totalPrice': Price * count } }, { new: true }).select({ 'cart.totalPrice': 1 })
let total = updtotal.cart.totalPrice
res.json({ success: true, pricequan, total })
return
} else {
res.redirect("/login")

          }
     } catch (error) {
          console.log(error)
     }
}








// DELETE CART
const deleteCart = async (req, res) => {
     try {
          if (req.session.userid) {
               const wishcount = await userdata.findOne({_id:req.session.userid}).populate('wishlist.product')
               id = req.params.id
               console.log(id, 'varunna id')
               const userid = req.session.userid
               const userdatas = await userdata.findOne({ _id: userid, 'cart.items.product_id': id })
               console.log(userdatas.cart.items[0], 'ivde cmonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
               const index = userdatas.cart.items.findIndex(ids => ids.product_id.toString() == id)
               console.log(index, 'index')
               const proTotal = userdatas.cart.items[index].product_idtotal
               const deletedCa = await userdata.findOneAndUpdate({ _id: req.session.userid, 'cart.items.product_id': id }, { $pull: { 'cart.items': { product_id: id } }, $inc: { 'cart.totalPrice': -proTotal } }, { new: true }).populate('cart.items.product_id')
               res.render('Cart', { userdata: deletedCa,wishcount })
          } else {
               res.redirect('/login')
          }
     } catch (error) {
          console.log(error)
     }
}












module.exports = {
     cartview,
     cart,
     changeqty,
     deleteCart

}