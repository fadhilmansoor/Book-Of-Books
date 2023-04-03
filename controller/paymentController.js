const users = require('../model/userDataModel')
const orderData = require('../model/OderData')
const OderData = require('../model/OderData')
const coupanData = require('../model/coupenmodel') 
const { v4: uuidv4 } = require("uuid")
const Razorpay = require('razorpay')
const crypto = require('crypto')
require('dotenv').config();
const dotenv = require('dotenv')
const { Console } = require('console')

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// CHECKOUT RENTERING
const checkout = async (req, res) => {
  try {
    if (req.session.userid) {
      const id = req.session.userid
      const userdata = await users.findOne({ _id: id }).populate('cart.items.product_id')
      res.render('payment', { data: userdata })

    } else {
      res.redirect('/login')
    }

  } catch (error) {
    console.log(error.message)
  }
}


// PAYMENT CHECKING
const addpayment = async (req, res) => {
  try {
    if (req.session.userid) {
      userid = req.session.userid
      
      const address = req.body.address,
      payment = req.body.payment
      if (address == "select address") {
        res.json({ address: true })
      }else if (payment==undefined){
        res.json({payment : true})
      } else {

      if (req.body.payment == "COD") {
        const usoder = req.body
        const orders = req.body
        const coduser = await users.findOne({ _id: userid })
        const orderDat = []
        usoder.product = orderDat
        pro_id = req.body.prod_id

        if (!Array.isArray(usoder.prod_id)) {
          usoder.prod_id = [usoder.prod_id]
        }
   
        if (!Array.isArray(usoder.pro_qty)) {
          usoder.pro_qty = [usoder.pro_qty]
        }
        if (!Array.isArray(usoder.sprice)) {
          usoder.sprice = [usoder.sprice]
        }
        if (!Array.isArray(usoder.price_qty)) {
          usoder.price_qty = [usoder.price_qty]
        }
        for (let i = 0; i < usoder.prod_id.length; i++) {
          const prod_id = usoder.prod_id[i]
          const pro_qty = usoder.pro_qty[i]
          const sprice = usoder.sprice[i]
          const price_qty = usoder.price_qty[i]

          orderDat.push({
            productid: prod_id,
            quantity: pro_qty,
            singlePrice: sprice,
            singleTotal: price_qty
          })
        }
        const order = new OderData({
          userid: req.body.userid,
          product: usoder.product,
          total: req.body.total,
          date: Date.now(),
          delveryAddress: req.body.address,
          paymentType: req.body.payment,
          orderId: `order_id_${uuidv4()}`,
          coupan:req.body.code
        })


        const save = await order.save();
        await coupanData.updateOne({code:req.body.code},{$push:{userused:userid}})
        res.json({ status: true })
      }
      else if (req.body.payment == "UPI") {
        let status = "pending"
        const usoder = req.body
        const coduser = await users.findOne({ _id: userid })
        const orderDat = []
        usoder.product = orderDat
        pro_id = req.body.prod_id
        if (!Array.isArray(usoder.prod_id)) {
          usoder.prod_id = [usoder.prod_id]
        }
        if (!Array.isArray(usoder.pro_qty)) {
          usoder.pro_qty = [usoder.pro_qty]
        }
        if (!Array.isArray(usoder.sprice)) {
          usoder.sprice = [usoder.sprice]
        }
        if (!Array.isArray(usoder.price_qty)) {
          usoder.price_qty = [usoder.price_qty]
        }
        for (let i = 0; i < usoder.prod_id.length; i++) {
          const prod_id = usoder.prod_id[i]
          const pro_qty = usoder.pro_qty[i]
          const sprice = usoder.sprice[i]
          const price_qty = usoder.price_qty[i]
          orderDat.push({
            productid: prod_id,
            quantity: pro_qty,
            singlePrice: sprice,
            singleTotal: price_qty
          })
        }
        const order = new OderData({
          userid: req.body.userid,
          product: usoder.product,
          total: req.body.total,
          status: "pending",
          date: Date.now(),
          delveryAddress: req.body.address,
          paymentType: req.body.payment,
          orderId: `order_id_${uuidv4()}`,
          coupan:req.body.code
        })
        const save = await order.save()
        await coupanData.updateOne({code:req.body.code},{$push:{userused:userid}})
        const latestOrder = await orderData.findOne({}).sort({ date: -1 }).lean();
        let options = {
          amount: req.body.total * 100,
          currency: "INR",
          receipt: "" + latestOrder._id
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            console.log(err);
          }
        
          res.json({ viewRazorpay: true, order })
        })
      }else if(req.body.payment  == 'wallet'){
        const usoder = req.body
        const orders = req.body
        const orderDat = []
        usoder.product = orderDat
        pro_id = req.body.prod_id
        const total = req.body.total
        const coduser = await users.findOne({ _id: userid })
         if(coduser.wallet >= total){
        if (!Array.isArray(usoder.prod_id)) {
          usoder.prod_id = [usoder.prod_id]
        }
        if (!Array.isArray(usoder.pro_qty)) {
          usoder.pro_qty = [usoder.pro_qty]
        }
        if (!Array.isArray(usoder.sprice)) {
          usoder.sprice = [usoder.sprice]
        }
        if (!Array.isArray(usoder.price_qty)) {
          usoder.price_qty = [usoder.price_qty]
        }
        for (let i = 0; i < usoder.prod_id.length; i++) {
          const prod_id = usoder.prod_id[i]
          const pro_qty = usoder.pro_qty[i]
          const sprice = usoder.sprice[i]
          const price_qty = usoder.price_qty[i]

          orderDat.push({
            productid: prod_id,
            quantity: pro_qty,
            singlePrice: sprice,
            singleTotal: price_qty
          })
        }
        const order = new OderData({
          userid: req.body.userid,
          product: usoder.product,
          total: req.body.total,
          date: Date.now(),
          delveryAddress: req.body.address,
          paymentType: req.body.payment,
          orderId: `order_id_${uuidv4()}`,
          coupan:req.body.code
        })
        const save = await order.save();
        await coupanData.updateOne({code:req.body.code},{$push:{userused:userid}})
        const balance =  coduser.wallet - req.body.total
        const walletminus = await users.updateOne({_id:req.session.userid},{$set:{wallet:balance}})
        res.json({ status: true })
      }else{
       res.json({ insufficient:true })
    }
    } else {
      res.json({ radio: true })
    }
    }
    }else{
      res.redirect('/login')
    } 
  } catch (error) {
    console.log(error.message)
  }
}

// VERIFYING RAZORPAY
const verifyPayment = async (req, res) => {
  try {
    const details = req.body
    let hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)
    hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id)
    hmac = hmac.digest('hex')

    if (hmac == details.payment.razorpay_signature) {
      const latestOrder = await orderData.findOne({}).sort({ date: -1 }).lean();
      const change = await orderData.updateOne({ _id: latestOrder._id }, { $set: { status: "confirmed "} })
      res.json({ status: true })
      if (change) {
      }
    } else {
      console.log("Failed");
      res.json({ failed: true })
    }

  } catch (error) {
    console.log(error.message)
  }
}

// // APPLAY COUPAN
const applycoupan = async (req,res)=>{
    try {
          const code = req.body.code
          const total = req.body.total  
          const Code = code.toUpperCase()
          const id = req.session.userid
          const coupon = await coupanData.findOne({code:Code})
          if(coupon){
            const used = await coupanData.findOne({code:Code,userused:{$in:[id]}})
            const datenow = Date.now()
            if(used){
                res.json({used:true})
            }else{
                if(datenow<=coupon.expirationDate){
                if(coupon.minpurachaseAmount<=total){
                    let parcentage = total*(coupon.parcentageOff)/100
                    if(parcentage>coupon.maxDiscount){
                 let Discount = coupon.maxDiscount
                 let totalPrice = (total-Discount)
                 res.json({final:true,totalPrice,Discount,Code})
                    }else{
                let Discount = parcentage
                let totalPrice = (total-Discount)
                res.json({final:true,totalPrice,Discount,Code})
                    }
                } else {
                    res.json({ finalnot: true })
                  }
                } else {
                  res.json({ dateexpr: true })
                }
      
              }
            } else {
              res.json({ invalid: true })
            }      

    } catch (error) {
        console.log(error)
    }
    
    }
    







module.exports = {
  checkout,
  addpayment,
  verifyPayment,
  applycoupan
  
}