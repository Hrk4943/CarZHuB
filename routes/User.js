const express = require('express')
const router = express.Router()



const userController = require('../controllers/userController')
const session = require('../middleware/session')


router.get('/', userController.home)
router.get('/login', userController.signin)
router.get('/signup', userController.signup)
router.get('/forgotpassword', userController.forgotpassword)
router.get('/allproducts', userController.allproduct)
router.get('/singleproduct/:id', userController.singleproduct)
router.get('/categoryFilter/:id', userController.categoryFilter)
router.get('/brandFilter/:id', userController.brandFilter)
router.get('/fuelFilter/:id', userController.fuelFilter)
router.get('/locationFilter/:id', userController.locationFilter)
router.get('/wishlist', userController.wishlist)
router.get('/carblocking/:id', userController.carblocking)
router.get('/blockedcars', userController.blockedcarpage)
router.get('/ordersuccess/:id', userController.ordersuccess)
router.get('/ordersuccesshome', userController.successmail)
router.get('/profile', userController.profile)
router.get('/editprofile/:id', userController.editprofilepage)
router.get('/logout', userController.logout)


router.post('/', userController.login)
router.post('/otp', userController.otp)
router.post('/resendotp', userController.resendotp)
router.post('/verifyotp', userController.verifyotp)
router.post('/resetpassword', userController.resetpassword)
router.post('/verifypasswordotp', userController.verifypasswordotp)
router.post('/setnewpassword', userController.settingpassword)
router.post('/addToWishlist/:productId', userController.addtowishlist)
router.post('/removeFromWishlist/:id', userController.removeFromWishlist)
router.post('/couponcheck', userController.couponCheck)
router.post('/order', userController.order)
router.post('/verifyorder', userController.verifyorder)
router.post('/updateprofile/:id', userController.updateprofile)
router.post('/search',userController.search)


module.exports = router