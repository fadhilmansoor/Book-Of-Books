const users = require('../model/userDataModel')
const products = require('../model/ProductsModel')
const category = require('../model/categoryModel')
const banner = require('../model/bannerModel')
const Order = require('../model/OderData')
const coupondata = require('../model/coupenmodel')
const session = require('express-session')
const uuid = require('uuid')
const { name } = require('ejs')
require("dotenv").config();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountsid, authtoken);


//HOME
const home = async (req, res) => {
    try {
         let id = null
        const pro = await products.find({}).limit(8)
        const cat = await category.find({})
        const bannerhome = await banner.find({})
        //  console.log(bannerhome)
        if (req.session.userid) {
            const udata = await users.findOne({ _id: req.session.userid }).populate('cart.items.product_id')
            const wishcount = await users.findOne({_id:req.session.userid}).populate('wishlist.product')
            console.log(udata, 'hoes');
            if (pro) {
                res.render('home', { pro, cat, udata, bannerhome ,wishcount})
            }
        } else {
            const udata = null
            const wishcount = null
            res.render('home', { pro, cat, udata, bannerhome , wishcount })
        }

    } catch (error) {
        console.log(error)
    }
}


//LOGINHOME
const loginhome = async (req, res) => {
    try {
        if (req.session.userid) {
            res.redirect('/')
        } else {
            res.render('userlogin')
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

//VERIFY USER
const userverify = async (req, res) => {
    try {
        const name = req.body.name
        const password = req.body.password
        const userdata = await users.findOne({ name: name })
        console.log(userdata)
        if (userdata) {
            if (userdata.status) {
                const found = await bcrypt.compare(password,userdata.password)
                if (found) {
                    console.log(userdata)
                    req.session.userid = userdata._id
                    res.redirect('/')
                } else {
                    res.render('userlogin', { message: "password is incorret" })
                }
            } else {
                res.render('userlogin', { message: "invalid username" })
            }
        } else {
            res.render('userlogin', { message: "not found please login" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
//SIGNUP
const newuser = async (req, res) => {
    try {
      if(req.query.ref){
req.session.userRef = req.query.ref
req.session.ref = 500
      }
        res.render('signup')
    } catch (error) {
        console.log(error)
    }
}

//SIGNUP
const postSignup = async (req, res) => {
    try {
        const datacheck = await users.findOne({ $or: [{ name: req.body.name }, { password: req.body.password }] })
        if (datacheck) {
            res.render('signup', { message: "username or password already exits" })
        } else {
const ref = req.session.ref
console.log(ref);
        const password = req.body.password
        const bcryptpass = await bcrypt.hash(password,10)
            const userInfo = new users({
                name: req.body.name,
                password:bcryptpass,
                mobile: req.body.moblie,
                wallet:ref
            })
            console.log(userInfo)
            await userInfo.save()
          const userIdRef = req.session.userRef
          await users.findOneAndUpdate({_id:userIdRef},{$inc:{wallet:1000}})
           req.session.ref = null
           req.session.userRef = null
           
            console.log(userInfo.mobile)
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// FORGOT PASSWORD
const forgotpassword = async (req,res,next)=>{
    try {
      res.render('forgotpassword')
    } catch (error) {
      next()
    }
  }

const forgotpasswordpost = async(req,res)=>{
try {
    req.session.user = req.body;
    const found = await users.findOne({name: req.body.name,mobile:req.body.mobile });
    if (found) {
      mobile = req.body.mobile;
      const otpResponse = await client.verify.v2
        .services("VA050f48df53a4d34a569d9328faee9b67")
        .verifications.create({
          to: `+91${mobile}`,
          channel: "sms",
        });
      res.render("otp");
    } else if (req.body.name == "" || req.body.mobile == "") {
      res.render("forgotpassword", { message: "All fields are required" });
    } else {
      res.render("forgotpassword", { message: "invalid email or number" });
    }
} catch (error) {
    console.log(error);
}
} 

//  OTP PAGE
const otp = async (req,res) => {
    const otp = req.body.otp;
    try {
        const details = req.session.user;
        console.log(details.mobile)
        const verifiedResponse = await client.verify.v2
        .services("VA050f48df53a4d34a569d9328faee9b67")
        .verificationChecks.create({
          to: `+91${details.mobile}`,
          code: otp,
        });
        if (verifiedResponse.status === "approved") {
          res.render("passwordchange");
        }else{
            res.render('otp',{message:"failed"})
        }   
    } catch (error) {
        console.log(error.message)
    }
} 

// CHANGE PASSWORD
const changepassword = async (req,res) => {
   try {
     const newpassword = await bcrypt.hash(req.body.password,10)
    const details = req.session.user;
    const userData = await users.updateOne(
      { name: details.name },
      { $set: { password: newpassword } }
    );
    if (userData) {
      res.redirect("/login");
    }
   } catch (error) {
    
   }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}

// LOGOUT
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/login");

    } catch (err) {
        console.log(err.message)
    }
}


//PROFILE VIEW
const userview = async (req, res) => {
    try {
        if (req.session.userid) {
            const userid = req.session.userid
            const userv = await users.findOne({ _id: userid })
            res.render('Profileview', { user: userv })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message

        )
    }
}

//EDIT PROFILE
const edituser = async (req, res) => {
    try {
        if (req.session.userid) {
            const id = req.session.userid
            const userData = await users.findOne({ _id: id })
            res.render('EditProfile', { userDatas: userData })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}

//UPDATE PROFILE
const updateuser = async (req, res) => {
    try {
        if (req.session.userid) {
            const userid = req.session.userid
            const check = await users.findOne({ name: req.body.newname })
            console.log(req.body.newname);
            if (check) {
                const updateData = await users.findOne({ _id: userid })
                res.render('Profileview', { user: updateData, message: "username is allready taken" })
            } else {
                const update = await users.updateOne({ _id: userid },
                    {
                        $set: {
                            name: req.body.newname,
                            mobile: req.body.newmobile,
                            email: req.body.email,
                            address: req.body.address
                        }
                    }
                )

                res.redirect('/profile')
            }
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}


// ORDERVIEW
const  orderview= async (req, res) => {
  try {
    if(req.session.userid){
      const id = req.session.userid
      const userdetails = await users.findOne({ _id: id })
      const order1 = await Order.find({ userid: id }).populate('product.productid').sort({ date: -1 })
      console.log(userdetails);
      res.render('userorder',
        {
           userdetails,
          order: order1
        })
    }else{
        res.redirect('/login')
    }
  } catch (error) {
    console.log(error.message);
  }

}

// ORDERSUCCESS
const ordersuccess = async (req, res) => {
    try {
        if (req.session.userid) {
        const userdetails = await users.findOne({_id: req.session.userid})
        const latestorder = await Order.findOne({}).sort({date:-1}).lean()
        const order = await Order.findOne({_id:latestorder._id}).populate('product.productid')
        for(let i =0;i< order.product.length;i++){
        await products.updateOne({_id:order.product[i].productid},
            {$inc:{stock: -latestorder.product[i].quantity}})
        }
            res.render('Ordersuccess')
            
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// FILTER PRODUCTS
const filter = async (req, res) => {
    try {
            const id = req.query.id
            const cat = await category.find({})
            let pro = await products.find({category:id}).populate('category')
            const bannerhome = await banner.find({})
            if (req.session.userid) {
                const udata = await users.findOne({ _id: req.session.userid }).populate('cart.items.product_id')
                const wishcount = await users.findOne({_id:req.session.userid}).populate('wishlist.product').count()
                if (pro) {
                    res.render('Shop', { pro, cat, udata,wishcount})
                }
            } else {
                const udata = null
                const wishcount = 0
                res.render('Shop', { pro, cat, udata,wishcount})
            }
    } catch (error) {
        console.log(error)
    }
}

// ADD ADRESS
const addaddress = async (req,res)=>{
try {
    if(req.session.userid){
     res.render('addaddress')
    }else{
     res.redirect('/login')
    }
} catch (error) {
    console.log(error)
}
}

// ADDING MULTIPLE ADDRESS
const multiaddress = async (req, res) => {
  try {
    const id = req.session.userid;
console.log(id);
    const address = req.body.addaddress; // get the address from the request body
    const user = await users.findOne({ _id: id });
    
    if (user) {
      const existingAddress = user.address.find(a => a.address1 === address);

      if (existingAddress) {
        // if the address already exists, increment its count
        await users.updateOne(
          { _id: id, 'address.address1': address },
          { $inc: { 'address.$.count': 1 } }
        );
      } else {
        // otherwise, add the address to the user's address array
        await users.updateOne(
          { _id: id },
          { $push: { address: { address1: address } } } // just push the address, no need to specify count
        );
      }
      
      res.redirect('/profile');
    } else {
      // handle the case where the user is not found
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
}

// ADDING TO CHECKOUT
const addresstocheckout = async (req, res) => {
  try {
    const id = req.session.userid;
    const address = req.body.addaddress; // get the address from the request body
    const user = await users.findOne({ _id: id });
    
    if (user) {
      const existingAddress = user.address.find(a => a.address1 === address);

      if (existingAddress) {
        // if the address already exists, increment its count
        await users.updateOne(
          { _id: id, 'address.address1': address },
          { $inc: { 'address.$.count': 1 } }
        );
      } else {
        // otherwise, add the address to the user's address array
        await users.updateOne(
          { _id: id },
          { $push: { address: { address1: address } } } // just push the address, no need to specify count
        );
      }
      
      res.redirect('/profile');
    } else {
      // handle the case where the user is not found
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
}



//RETURNORDERS
const Returnorder = async (req,res) => {
    try {
       let id = req.body.id 
    const orderdata = await Order.updateOne({_id:id},{$set:{status:"Return requsted"}})
    if(orderdata){
     res.json({success:true,status:"Return requsted"})
    }
    } catch (error) {
        console.log(error)
    }
}

// CANCELORDER
const cancelorder = async (req, res) => {
    try {
      let id = req.body.id;
      const orderData = await Order.updateOne({ _id:id },{ $set:{status: "cancelled" } })
      const order = await Order.findOne({_id:id}).populate('product.productid')
    for(let i=0;i<order.product.length;i++){
     await products.updateOne({_id: order.product[i].productid},{$inc:{stock: order.product[i].quantity}})
    }
      if (order.paymentType != "COD") {
console.log("hhhhhhhhhhhhhhhhhhh");
        const walletupdate = await users.updateOne({ _id: order.userid }, { $inc: { wallet: order.total }});
      }
    res.json({cancelled:true})
        
    } catch (error) {
      console.log(error);
    }
  };
  

// EDIT HOME ADDRESS
const editaddress = async (req,res) => {
   try {
    const id = req.params.id
    const iduser      = req.session.userid
   const user = await users.findOne({_id:iduser,'address._id':id}, { "address.$": 1 })
   res.render('editaddress',{user})
   } catch (error) {
    console.log(error)
   }
}

// UPDATE EDIT HOME ADDRESS
const editupdate = async (req,res) => {
    try {
        const id = req.params.id
        console.log(id);
        const iduser      = req.session.userid
        const user = await users.findOne({_id:iduser,'address._id':id}, { "address.$": 1 })
        console.log(user);
        const newAddress1 = req.body.address
        console.log(newAddress1);
        
       await users.updateOne(
          { _id:iduser, "address._id":id},
          { $set: { "address.$.address1": newAddress1 } }
        )
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
        res.redirect('/profile')
    } catch (error) {
      console.log(error);
    }
  };

  



// DELETEADDRESS
const deleteAddress = async (req, res) => {
    try {
     const id = req.body.id;
      const iduser      = req.session.userid
      const user = await users.findOne({_id:iduser,'address._id':id}, { "address.$": 1 })    
      const usersdel =  await users.updateOne(
          { _id:iduser},
          { $pull: { address: { _id: id } } }
        )
        console.log(usersdel);
      if (usersdel) {
        res.json({ success: true });
      }
    } catch (error) {
      console.log(error);
    
    }
  };

// WISHLIST
const wishlist = async (req,res) =>{
     try {
     if(req.session.userid){
        const wishlist = 0
        const id = req.session.userid
        const pro = await products.find({})
        const cat = await category.find({})
        const udata = await users.findOne({ _id: req.session.userid }).populate('cart.items.product_id');
        const wishlistData = await users.findOne({ _id: id }).populate('wishlist.product')
        res.render('wishlist',{userData:wishlistData,udata})
     }else{
       res.redirect('/login')
     }
     } catch (error) {
        console.log(error.message)
     }
}

// ADD TO WISHLIST
const addwhislist = async (req,res)=>{
   try {
    id = req.params.id
   console.log(id)
    const found = await users.findOne({_id:req.session.userid,"wishlist.product":id})
    const cat =  await category.find({})
    const userData = await users.findOne({_id:req.session.userid}).populate('wishlist.product')
    const udata = await users.findOne({ _id: req.session.userid }).populate('cart.items.product_id')
    const product = await products.find({}).populate('category')
    if(found){
    res.render('wishlist',{ product:  product ,udata, userData: userData, categories: cat, message: 'already exists'})
    }else{
    const userid = req.session.userid;
    const  userdetails = await users.findOne({_id:userid})
    const wishlistInserted = await users.updateOne({ _id: req.session.userid },{ $push: { wishlist: { product: id } } })
    const whislistinsert = await users.findOne({_id:userid}).populate('wishlist.product')
    res.render('wishlist',{ product: product , userData: whislistinsert,udata, message2: 'added successfully'})
    }
} catch (error) {
    console.log(error)
   }
}

// DELETE WHISLIST
const deletewish = async (req, res) => {
    try {
      const id = req.session.userid
      proId = req.body.product
      const deleted = await users.updateOne({ _id:id },{$pull:{ wishlist: { product: proId } } })
  console.log(deleted);
      res.json({ success: true })
    } catch (error) {
      console.log(error.message);
    }
  }

// WISHLIST TO CART
const wishtocart = async (req,res) => {
 try {
const productid = req.body.id
const Price     = req.body.Price
const userid = req.session.userid
const user   = await users.findById(userid);
const found = await users.findOne({_id:userid,"cart.items.product_id":productid})
if(found){
  res.json({failed:true});
}else{
const productdetails = await products.findById(productid);
user.cart.items.push({
  product_id:productid,
  qty:1,
  product_idtotal:productdetails.Price
});
user.cart.totalPrice += productdetails.Price
await users.updateOne({_id:userid},{$pull:{wishlist:{product:productid}}})
await user.save();
// const cartTotalPrice = user.cart.items.reduce((acc, item) => acc + item.product_idtotal, 0);
// await users.updateOne({ _id: userid }, { $set: {totalPrice:cartTotalPrice } });
res.json({success:true})
}
 } catch (error) {
    console.log(error)
 }
}


// CHANGEPASSWORD
const profilechange = async (req,res) => {
   try {
    const data = req.body
    console.log(data,"hlooooooooooodataaaaaaaaachangepassword")
    const oldpass = data.oldPassword
    const userData = await users.findOne({_id:data.userid})
    if(userData){
      const compare = await bcrypt.compare(oldpass,userData.password)
      if(compare){
         if(data.newPassword == data.confirmPassword){
          const  hash = await bcrypt.hash(data.newPassword,10)
          const update = await users.updateOne({_id:data.userid},{$set:{password:hash}})
          res.json({success:true})
         }else{
          res.json({different:true,message:"the values are diffrent"})
         }
      }else{
        res.json({notmatch:true})
      }
    }
   } catch (error) {
    console.log(error)
   }
}
   
module.exports = {
    home,
    loginhome,
    filter,
    userverify,
    logout,
    newuser,
    postSignup,
    userview,
    edituser,
    updateuser,
    orderview,
    ordersuccess,
    addaddress,
    multiaddress,
    Returnorder,
    editaddress,
    deleteAddress,
    wishlist,
    addwhislist,
    deletewish,
    wishtocart,
    editupdate,
    forgotpassword,
    forgotpasswordpost,
    otp,
    changepassword,
    cancelorder,
    profilechange,
    addresstocheckout
    
}