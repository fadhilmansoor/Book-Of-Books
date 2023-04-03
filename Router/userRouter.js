const express = require ('express');
 
const userRouter = express();

const userController = require ('../controller/userController');

const cart = require ('../controller/cartcontroller')

const usermiddle = require ('../middlewares/usermiddle')

const checkoutController = require ('../controller/paymentController')

const navController = require ('../controller/NavControoler')

const path = require ("path");
const bodyParser = require ('body-parser');
userRouter.use (bodyParser.json());
userRouter.use (bodyParser.urlencoded({extended:true}));

userRouter.set ("view engine","ejs");
userRouter.set ("views",'./views/users');


//nocache
const nocache = require ('nocache');
userRouter.use(nocache())


// session
const session = require ('express-session');
userRouter.use(session({
    secret:"sessionKey",
    resave : false,
    saveUninitialized:true,
    cookie:{maxAge:6000000}
}))







userRouter.get('/',userController.home);
userRouter.get('/filter', userController.filter)

userRouter.get('/login',usermiddle.loginuser,userController.loginhome);
userRouter.post('/login',userController.userverify);
userRouter.get('/signup',userController.newuser)
userRouter.post('/signup',userController.postSignup)
userRouter.get('/forgotpassword',userController.forgotpassword)
userRouter.post('/forgotpassword',userController.forgotpasswordpost)
userRouter.post('/otp',userController.otp)
userRouter.post('/changepassword',userController.changepassword)

userRouter.get('/logout',userController.logout)

userRouter.get('/cart',cart.cartview)
userRouter.post('/Cart',cart.cart)

userRouter.get('/whislist',userController.wishlist)
userRouter.get('/addtowish/:id',userController.addwhislist)
userRouter.post('/deletewishlist',userController.deletewish)
userRouter.post('/wishtocart',userController.wishtocart)

userRouter.post('/change_quantity',cart.changeqty)
userRouter.get('/remove/:id',cart.deleteCart)

userRouter.get('/profile',userController.userview)
userRouter.get('/ProfileEdit',userController.edituser)
userRouter.post('/ProfileEdit',userController.updateuser)
userRouter.post('/addaddress',userController.multiaddress)
userRouter.get('/editaddress/:id',userController.editaddress)
userRouter.post('/editaddress/:id',userController.editupdate)
userRouter.post('/deleteaddress',userController.deleteAddress)
userRouter.post('/change_password',userController.profilechange)

userRouter.get('/checkout',checkoutController.checkout)
userRouter.post('/check_out',checkoutController.addpayment)
userRouter.post('/verifypayment',checkoutController.verifyPayment)
userRouter.post('/apply_coupan',checkoutController.applycoupan)
userRouter.get('/success_page',userController.ordersuccess)
userRouter.post('/adreesstocheckout',userController.addresstocheckout)

userRouter.get('/orderview',userController.orderview)
userRouter.post('/return_order',userController.Returnorder)
userRouter.post('/cancel_order',userController.cancelorder)

userRouter.get('/shop',navController.shop)
userRouter.get('/blog',navController.blog)
userRouter.get('/About',navController.About)



module.exports = userRouter