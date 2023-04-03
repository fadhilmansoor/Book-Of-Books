const userdata = require('../model/userDataModel');



//RENTERING USER
const users = async (req, res) => {
    try {
        if (req.session.adminid) {
            const viewuser = await userdata.find({})
            res.render('UsermanagementNew', { viewUser: viewuser })
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);
    }
}

//USERBLOCK || UNBLOCK
const blockuser = async (req, res) => {
    try {
        if (req.session.adminid) {
            const id = req.params.id
            userData = await userdata.findOne({ _id: id })
            if (userData.status) {
                await userdata.updateOne({ _id: id }, { $set: { status: false } })
                res.redirect('/admin/Usermangment')
            } else {
                await userdata.updateOne({ _id: id }, { $set: { status: true } })
                res.redirect('/admin/Usermangment')
            }
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}














module.exports = {
    users,
    blockuser
}