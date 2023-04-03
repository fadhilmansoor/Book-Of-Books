const express = require ("express");
 const adminrouter = express ();

//adminconroller
 const adminController = require ("../controller/adminController");

//products
const products = require("../controller/ProductsController")

//categorycontroller
const categoryController = require ("../controller/categoryController");

// //usermangment 
const usermangment = require ("../controller/adminusercontroller")


//nocache
const nocache = require ('nocache');
adminrouter.use(nocache())


// session
const session = require ('express-session');
adminrouter.use(session({
    secret:"sessionKey",
    resave : false,
    saveUninitialized:true,
    cookie:{maxAge:5000000000}
}))



adminrouter.set ("view engine","ejs")
adminrouter.set ("views",'./views/Admin')



const bodyParser = require ('body-parser');
adminrouter.use (bodyParser.json());
adminrouter.use (bodyParser.urlencoded({extended:true}))

 const multer = require ("multer");
const path = require ("path");
const { appendFile } = require("fs");

 const storage = multer.diskStorage({
    destination:function(req,file,cb){

cb(null,path.join('Public/Proudectsimages'));

    },
filename:function(req,file,cb){
    const name ='-'+file.originalname;
cb(null,name);
}
 });
//  const uploade = multer({storage:storage})
adminrouter.use (multer({storage:storage}).fields([{name:'image'}]));

// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../public/Proudectsimages'))
//     },
//     filename: function (req, file, cb) {
//         const name = Date.now() + '-' + file.originalname;
//         cb(null, name)
//     }

// });
// const upload = multer({storage: storage});



adminrouter.get ('/',adminController.loginLoad);
 

adminrouter.post ('/',adminController.verifyLogin); 


adminrouter.get ('/Dashbord',adminController.LoadDashbord); 

adminrouter.get ('/addproducts',products.addProducts);

adminrouter.post ('/addproducts',products.insertProducts);
 
adminrouter.get ('/category',categoryController.category)

adminrouter.get('/addcategory',categoryController.addcategorypage)

adminrouter.post('/addcategory',categoryController.newcategory)

adminrouter.get('/category/deletecategory/:id',categoryController.catedelete)

adminrouter.get('/category/editcategory/:id',categoryController.vieweditcate)

adminrouter.post('/category/editcategory/:id',categoryController.editcate)

adminrouter.get('/viewproducts',products.Productview)

adminrouter.get('/',adminController.logout)

adminrouter.get('/viewprouducts/deleteproducts/:id',products.proddelete)

adminrouter.get('/viewproducts/editproducts/:id',products.vieweditpro)

adminrouter.post('/editproducts/:id',products.editproduct)

adminrouter.get('/usermangment',usermangment.users)

adminrouter.get('/usermangment/blockuser/:id',usermangment.blockuser)

adminrouter.get('/bannermangment',adminController.bannercheck)

adminrouter.get('/addbanner',adminController.addbannerinfo)

adminrouter.post('/addbanner',adminController.addbanner);

adminrouter.get('/bannermangment/deletebanner/:id',adminController.deletebanner)

adminrouter.get('/coupenmangment',adminController.copenview)

adminrouter.get('/addcoupen',adminController.addcoupen)

adminrouter.post('/addcoupen',adminController.addedcoupen)

adminrouter.get('/deletecoupan/:id',adminController.deletecoupan)

adminrouter.get('/editcoupan/:id',adminController.editcoupan)

adminrouter.post('/editcoupan/:id',adminController.edittedcoupan)

adminrouter.get('/Orderreport',adminController.orderreport)

adminrouter.post('/Orderreport',adminController.changeorder)

adminrouter.get('/singleorderview/:id',adminController.singleorder)

adminrouter.get('/salesReport',adminController.salesreport)

adminrouter.post('/salesReport',adminController.salesreport1)

// adminrouter.get('/salesreport',adminController.salesreport1)

module.exports = adminrouter;