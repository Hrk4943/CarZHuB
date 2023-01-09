const express = require('express')
const router = express.Router()


const adminController = require('../controllers/adminController')
const session = require('../middleware/session')


//get
router.get('/',adminController.admin)
router.get('/adminhome',session.adminSession,adminController.home)

//get all page
router.get('/alluser',session.adminSession,adminController.alluser)
router.get('/allproduct', session.adminSession, adminController.viewproduct)
router.get('/allBanner', session.adminSession, adminController.allBanner)
router.get('/allcoupon',session.adminSession,adminController.Coupon)

router.get('/addproduct', session.adminSession, adminController.addproductpage)

router.get('/editproductpage/:id', session.adminSession, adminController.editproductpage)
router.get('/soldcar', session.adminSession, adminController.soldcarpage)
router.get('/blockedcars', session.adminSession, adminController.blockedcarpage)
router.get('/location',session.adminSession,adminController.location)
router.get('/brandpage', session.adminSession, adminController.brandpage)
router.get('/category', session.adminSession, adminController.categorypage)
router.get('/fuel',  session.adminSession, adminController.fueltypepage)

router.get('/addbanner', session.adminSession, adminController.addBannerPage)
router.get('/addcoupon',session.adminSession,adminController.addCouponpage)


//post
router.post('/',adminController.adminlogin)

router.post ('/blockUser/:id',session.adminSession,adminController.blockUser)
router.post('/unblockUser/:id',session.adminSession,adminController.unblockUser)
router.post('/addproduct', session.adminSession, adminController.addproduct)
router.post('/deleteproduct/:id', session.adminSession, adminController.deleteproduct)
router.post('/updateProduct/:id', session.adminSession, adminController.updateProduct)
router.post('/unblockCar/:id', session.adminSession, adminController.unblockCar)
router.post('/blockCar/:id', session.adminSession, adminController.blockCar)
router.post('/soldCarp/:id', session.adminSession, adminController.soldCarp)
router.post('/soldCarb/:id', session.adminSession, adminController.soldCarb)
router.post('/notsoldCar/:id', session.adminSession, adminController.notsoldCar)


router.post('/addbrand', session.adminSession, adminController.addBrand)
router.post('/deletebrand/:id', session.adminSession, adminController.deletebrand)

router.post('/addcategory', session.adminSession, adminController.addcategory)
router.post('/deletecategory/:id', session.adminSession, adminController.deletecategory)

router.post('/addfuel', session.adminSession, adminController.addfuel)
router.post('/deletefuel/:id', session.adminSession, adminController.deletefuel)

router.post('/addlocation',session.adminSession,adminController.addlocation)                  
router.post('/deletelocation/:id',session.adminSession,adminController.deletelocation)

router.post('/addbanner', session.adminSession, adminController.addBanner)
router.post('/deletebanner/:id', session.adminSession, adminController.deletebanner)



router.post('/logout', session.adminSession,adminController.logout)

router.post("/addCoupon", session.adminSession,adminController.addCoupon)
router.post("/deleteCoupon/:id", session.adminSession, adminController.deleteCoupon)

module.exports=router