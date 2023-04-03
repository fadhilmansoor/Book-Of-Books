const session = require('express-session');
const Admin = require('../model/adminlogin');
const bannerModel = require('../model/bannerModel');
const banner = require('../model/bannerModel');
const moment = require('moment')
const coupemodel =require('../model/coupenmodel');
const coupenmodel = require('../model/coupenmodel');
const { clearCache } = require('ejs');
const order = require ('../model/OderData')
const usermodel = require ('../model/userDataModel');

//LOGIN START
const loginLoad = async (req, res) => {
    try {
        if (req.session.adminid) {
            res.redirect('/admin/Dashbord')
            return
        }
        res.render('login', { message: '' })
    } catch (error) {
        console.log(error.message)
    }
}


//LOGIN CHECKING
const verifyLogin = async (req, res) => {

    try {

        const name = req.body.name;
        const password = req.body.password;
        const admindata = await Admin.findOne({ name: name });

        if (admindata) {
            if (password === admindata.password) {
                console.log(admindata)
                req.session.adminid = admindata
                res.redirect('/Admin/Dashbord')
            } else {
                res.render('login', { message: "password is incorret" });
            }
        } else {
            res.render('login', { message: "username is incorret" });
        }

    } catch (error) {
        console.log(error.message);
    }
}
//RENTER DASHBORD
const LoadDashbord = async (req, res) => {
    try {
        if (req.session.adminid) {
            const  usercount = await usermodel.find({}).count()
            const orderdata  = await order.find({}).sort({date:-1}).populate('product.productid').populate('userid')
            const delevired  = await order.find({status:"Delivered"}).count()
            const conformed  = await order.find({status:"conformed"}).count()
            const shipped    = await order.find({status:"Shipped"}).count()
            const cancelled  = await order.find({status:"cancelled"}).count()
            const returned   = await order.find({status:"Returned"}).count()
            const UPI        = await order.find({paymentType:"UPI"}).count()
            const COD        = await order.find({paymentType:"COD"}).count()
            const wallet     = await order.find({paymentType:"wallet"}).count()
            const ordertotal = await order.find({}).count()
            const total       = await order.find({status:"Delivered"})
            const pending    = delevired - ordertotal
            let revenue =0
            for(let i=0;i<total.length;i++){
            revenue =revenue+total[i].total
          }
          const revenueOfTheWeekly = await order.aggregate([
            {
              $match: {
                date: {
                  $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }, status: {
                  $eq: "Delivered"
                }
              }
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$total" }
              }
            }
          ])
          const weeklyRevenue = revenueOfTheWeekly.map((item) => {
            return item.totalAmount;
          })


        const salesChart = await order.aggregate([
            {
              $match: {
                status: {
                  $eq: "Delivered"
                }
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                sales: { $sum: "$total" },
              }
            },
            {
              $sort: { _id: 1 }
            },
            {
              $limit: 7
            }
          ])
          const date = salesChart.map((item) => {
            return item._id;
          })
          const sales = salesChart.map((item) => {
            return item.sales;
          })
          console.log( sales+"hloooooooowekklyrevenue")
            res.render('Dashbord',{
                usercount:usercount,
                orderdata:orderdata,
                delevired :delevired,
                ordertotal:ordertotal,
                pending:pending,
                revenue,
                UPI,
                COD,
                wallet,
                revenueOfTheWeekly,
                date,
                conformed,
                shipped,
                cancelled,
                returned,
                sales});
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);

    }
}

// LOGOUT
const logout = async (req, res) => {
    try {
if(req.session.adminid){
        req.session.destroy();
        res.redirect("/admin");
}else{
   res.redirect('/admin')
}
    } catch (err) {
        console.log(err.message)
    }
}

// BANNER
const bannercheck = async (req, res) => {
    try {
        if (req.session.adminid) {
            const bannerdata = await banner.find({})
            res.render('bannermangment', { bannerinfo: bannerdata })
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error)
    }
}

// ADD BANNER RENTRING
const addbannerinfo = async (req, res) => {
    try {
        if (req.session.adminid) {
            res.render('addbanner')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error)
    }
}

// ADD BANNER
const addbanner = async (req, res) => {
    try {
        if (req.session.adminid) {
            let image = req.files.image
            let imageUrl = []
            image.forEach((el, i) => {
                imageUrl.push(el.filename)
            })
            console.log(imageUrl);
            const adding = new banner({
                name: req.body.name,
                image:imageUrl,
                description: req.body.description
            })
            await adding.save()
            res.redirect('/admin/bannermangment')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}

// DELETE BANNER
const deletebanner = async (req, res) => {
    try {
        if (req.session.adminid) {
            let id = req.params.id
            const deleted = await banner.deleteOne({ _id: id })
res.redirect('/admin/bannermangment')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error)
    }
}

// COUPAN MANGMENT
const copenview = async (req, res) => {
    try {
        if (req.session.adminid) {
        const find = await coupemodel.find({})
            res.render('coupanmangment',{find})
        } else {
            res.redirect('/admin/bannermangment')
        }
    } catch (error) {
        console.log(error.message)
    }
}

// ADD COUPEN
const addcoupen = async (req, res) => {
    if (req.session.adminid) {

        res.render('addcoupen')  
    } else {
        res.redirect('/admin')
    }
}

//ADD COUPEN
const addedcoupen = async(req,res)=>{
    try {
if(req.body.code.length===0){
    console.log(req.body)
res.render('addcoupen',{message:"value required in fileds"})
}else{
    let Code = req.body.code.trim().toUpperCase() 
    
    const check = await coupemodel.findOne({code:Code})
if(check){
res.render('addcoupen',{message:"coupen already exits"})
}else{
    console.log(req.body);
 const saveing =  new coupenmodel({
    code:Code,
maxDiscount:req.body.maxDiscount,
minpurachaseAmount:req.body.minpurachaseAmount,
expirationDate:req.body.expirationDate,
parcentageOff:req.body.parcentageOff
 })
const save = await saveing.save();
res.redirect('/admin/coupenmangment');
}
}
    } catch (error) {
        console.log(error)
    }
}

// DELETE COUPAN
const deletecoupan = async(req,res)=>{
try {
    const id = req.params.id
    const deleted = await coupemodel.deleteOne({_id:id})
  res.redirect('/admin/coupenmangment')
} catch (error) {
    console.log(error)
}
}

// EDIT COUPAN 
const editcoupan = async (req,res)=>{
try {
    id =req.params.id
    const editing = await coupemodel.findOne({_id:id})
    res.render('editcoupen',{edit:editing})

} catch (error) {
    console.log(error)
}
}

// EDITTING COUPAN(VALIDATION)
const edittedcoupan = async(req,res)=>{
try {
    id = req.params.id
    await coupemodel.updateOne({_id:id},{$set:{
        code:req.body.code,
        maxDiscount:req.body.maxDiscount,
        minpurachaseAmount:req.body.minpurachaseAmount,
        expirationDate:req.body.expirationDate,
        parcentageOff:req.body.parcentageOff
    }})
res.redirect('/admin/coupenmangment')
} catch (error) {
    console.log(error)
}
}

// ORDERRRENTRING
const orderreport = async(req,res)=>{
  
  const orderdata = await order.find({}).sort({date :-1})
   res.render('orderreport',{orderdata})

}

// ADMIN ORDER LIST 
const changeorder = async (req,res)=>{
    try{
    const orderid = req.body.orderid
    const newstatus = req.body.status 
    const update = await order.updateOne({orderId:orderid},{$set:{status:newstatus}});
    console.log(update);
    res.redirect('/admin/orderreport')
    }catch(error){
console.log(error)
    }
}

// SINGLE ORDERVIEW
const singleorder = async (req,res) => {
  try {
   
       id = req.params.id;
      const detail = await order.findOne({ _id:id }).populate("product.productid")
      .populate("userid");
     res.render('singleorder',{detail:detail})
 
  } catch (error) {
    console.log(error)
  }
}
//SALES REPORT
const salesreport = async (req,res) => {
  try {
    const done = await order.find({status:"Delivered"}).populate("product.productid")
    res.render('salesreport1',{done})
  } catch (error) {
    console.log(error)
  }
}



// SALES REPORT 1
const salesreport1 = async (req,res) => {
     try {
    const exitsdate = new Date(req.body.to)
    const newdate = new Date(exitsdate)
    newdate.setDate(exitsdate.getDate()+1);
    if(req.body.from==""||req.body.to==""){
        res.render('sales',{message:'all fields are equired'})
    }else{
const done = await order.find({status:"Delivered",date:{
  $gte:new Date(req.body.from),
  $lte:new Date(newdate)
}}).populate("product.productid")


        res.render('salesreport1',{done})
    }
     } catch (error) {
        console.log(error)
     }
}










module.exports = {

    loginLoad,
    verifyLogin,
    LoadDashbord,
    logout,
    bannercheck,
    addbannerinfo,
    addbanner,
    deletebanner,
    copenview,
    addcoupen,
    addedcoupen,
    deletecoupan,
    editcoupan, 
    edittedcoupan,
    orderreport,
    changeorder,
    singleorder,
    salesreport,
    salesreport1

}