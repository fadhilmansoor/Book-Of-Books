const Categories = require('../model/categoryModel');
const { render } = require('../Router/Adminrouter');


const category = async (req, res) => {
    try {
        if (req.session.adminid) {
            const categorydata = await Categories.find({})
            res.render('category', { categoryDatas: categorydata })
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)

    }
}

//ADD CATEGORY
const addcategorypage = async (req, res) => {
    try {
        if (req.session.adminid) {
            res.render('Addcategory')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);
    }
}

//NEW CATEGORY
const newcategory = async (req, res) => {
    try {
        if (req.session.adminid) {
            const category = req.body.category
            const description = req.body.description
            const upper = category.toUpperCase()
            if (category == "" || description == "") {
                res.render("Addcategory", { message: "please fill the blank" })

            } else {
                let Result = await Categories.findOne({ Category: upper })
                if (Result) {
                    res.render("Addcategory", { message: "Category already exits" })
                    Result = null
                } else {
                    const category = new Categories({
                        Category: upper,
                        description: req.body.description
                    })
                    const newcategory = await category.save()
                    if (newcategory) {
                        res.redirect('/admin/category')
                    } else {
                        res.render('Addcategory', { message: "SOMTHING WENT WRONG" })
                    }
                }
            }
            console.log(newcategory)
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}


//DELETE CATEGORY
const catedelete = async (req, res) => {
    try {
        if (req.session.adminid) {
            let id = req.params.id
            // console.log(catid)
            await Categories.deleteOne({ _id: id })
            res.redirect('/admin/category')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}

//EDIT CATERGORY RENTERING
const vieweditcate = async (req, res) => {
    try {
        if (req.session.adminid) {
            res.render('editcategory')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// EDITING CATEGORY
const editcate = async (req, res) => {
    try {
        if (req.session.adminid) {
            let editcate = req.body.editCategory
            let edirdescri = req.body.editdescription
            let uppercate = editcate.toUpperCase()
            // console.log(uppercate)
            let id = req.params.id
            const catedata = await Categories.findOne({ _id: id });
            if (catedata && catedata._id != id) {
                res.render('editCategory', { message: "ALDERDY EXITS", vieweditcate: catedata })
            } else {
        
                if (catedata.category == editcate) {
                    if (catedata.description == edirdescri) {
                        res.render('editcategory', { message: "this is same one", vieweditcate: catedata })
                        console.log(catedata)
                    } else {

                        await Categories.updateOne({ _id: id }, { $set: { description: edirdescri } })
                    }
                    res.redirect('/admin/category')
                } else {

                    await Categories.updateOne({ _id: id }, { $set: { Category: uppercate, description: edirdescri } })
                    res.redirect('/admin/category')
                }
            }
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}

//EXPORT
module.exports = {
    category,
    addcategorypage,
    newcategory,
    catedelete,
    vieweditcate,
    editcate
}