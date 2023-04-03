
const products = require('../model/ProductsModel');

const category = require('../model/categoryModel');



const Productview = async (req, res) => {
   try {
      if (req.session.adminid) {
         const prouductdata = await products.find({}).populate('category')
         //   console.log(prouductdata);
         res.render('viewproducts', { dataproduct: prouductdata })
      } else {
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error)
   }
}


//DELETE PRODUCTS
const proddelete = async (req, res) => {
   try {
      if (req.session.adminid) {
         let id = req.params.id
         await products.deleteOne({ _id: id })
         res.redirect('/admin/viewproducts')
      } else {
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error)
   }
}

//EDIT PRODUCTS RENTERING
const vieweditpro = async (req, res) => {
   try {
      if (req.session.adminid) {
         const id = req.params.id
         const editPro = await products.findOne({ _id: id })
         // console.log(editPro,'hhhhhhhh');
         res.render('editproducts', { editPro })
      } else {
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error.message)
   }
}

// EDITING PRODUCTS
const editproduct = async (req, res) => {
   try {
      if (req.session.adminid) {
         const image = []
         for (var i = 0; i < req.files.image.length; i++) {
            image[i] = req.files.image[i].path.substring(6)
         }
         const id = req.params.id
       
         console.log()
         if (image.length > 0) {
            await products.updateOne({ _id: id }, {
               $set: {
                  name: req.body.name,
                  category: req.body.category,
                  Price: req.body.Price,
                  image: image,
                  About: req.body.About,
                  stock: req.body.stock,
                  offer: req.body.Offer
               }
            })
            let Price = req.body.Price
            const Offer = req.body.Offer
            if(Offer>0){
               let newPrice = 0
               newPrice = Math.round(Price*Offer/100)
               console.log(newPrice)
               await products.updateOne({_id:id},{
                  $set:{
                     Price:newPrice
                  }
               })
            }
            console.log(products)
            res.redirect('/admin/viewproducts')
         } else {
            await products.updateOne({ _id: id }, {
               $set: {
                  productname: req.body.name,
                  category: req.body.category,
                  about: req.body.About,
                  price: req.body.Price,
               }
            })
         
           console.log(Offer)
            res.redirect('/admin/viewproducts')
         }
      } else {
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error.message)
   }

}

//ADD PRODUCTS RENTERING
const addProducts = async (req, res) => {
   try {
      if (req.session.adminid) {
         const categorys = await category.find()
         res.render('addproducts', { categorys });
      } else {
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error);

   }
}

//ADDING PRODUCTS 
const insertProducts = async (req, res) => {
   try {
      if (req.session.adminid) {
         let image = req.files.image
         console.log(image, "image");
         console.log(req.body, "body");
         let imageUrl = []
         image.forEach((el, i) => {
            imageUrl.push(el.path.substring(6))
         })
         const newPro = new products({
            name: req.body.name,
            Price: req.body.Price,
            About: req.body.About,
            image: imageUrl,
            category: req.body.category,
            stock: req.body.stock
         })
         await newPro.save()
         res.redirect('/admin/viewproducts')
      } else {
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error.message)
   }
}

module.exports = {
   Productview,
   proddelete,
   vieweditpro,
   editproduct,
   addProducts,
   insertProducts,

} 
