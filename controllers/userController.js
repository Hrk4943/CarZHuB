const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const BrandModel = require("../models/brandModel");
const TypeModel = require("../models/categoryModel")
const FuelModel = require('../models/fuelModel')
const LocationModel = require('../models/locationModel')
const Wishlist = require('../models/wishlistModel')
const UserMailModel = require('../models/usermailModel')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const OrderModel = require("../models/orderModel")
const BannerModel = require("../models/bannerModel");
const CouponModel = require('../models/couponModel')
// const { default: mongoose } = require("mongoose");
const Razorpay = require('razorpay')
const mongoose = require('mongoose');
const { nextTick } = require("process");
const { error } = require("console");
const wishlistModel = require("../models/wishlistModel");






//********************************************* START OTP **************************************************//
// Email OTP Verification

var FullName;
var UserName;
var Email;
var Phone;
var Password;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: 'Gmail',

  auth: {
    user: 'ideapad4943@gmail.com',
    pass: 'zaqppyuldvheicby',
  }

});



var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);



//********************************************* END OTP **************************************************//


module.exports = {

  // DEMO
  // demo: (req, res) => {
  //   try {
  //     res.render('user/profile', { login: true, user: req.session.user })

  //   } catch (err) {
  //     next(err)
  //   }
  // },




  // User home page
  home: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const banner = await BannerModel.find()
        const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 }).limit(3)
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        res.render("user/home", { login: true, user: req.session.user, banner, products, brand, fuel, type });
      } else {
        const banner = await BannerModel.find()
        const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 }).limit(3)
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        res.render('user/home', { login: false, banner, products, brand, fuel, type });
      }

    } catch (err) {
      next(err)
    }
    // res.send("You just created a User ...!!!");
  },

  // User login page
  signin: (req, res) => {
    try {
      let NoUser;
      let PwMatch
      if (!req.session.userLogin) {

        res.render('user/login', { NoUser, PwMatch });
      } else {
        res.redirect('/')
      }

    } catch (err) {
      next(err)
    }
  },


  //**********************************SIGNUP USER *******************************************/

  // OTP
  otp: async (req, res) => {

    FullName = req.body.fullName
    UserName = req.body.userName
    Email = req.body.email;
    Phone = req.body.phone
    Password = req.body.password

    const user = await UserModel.findOne({ email: Email });

    if (!user) {
      // send mail with defined transport object
      var mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
       
       

        res.render('user/otp');
      });

    }
    else {
      userExist = true
     
      res.render('user/signup', { userExist })
    }

    // } catch (err) {
    //   next(err)
    // }


  },


  resendotp: (req, res) => {
    // try {
      var mailOptions = {
        to: Email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
   
        res.render('user/otp', { msg: "otp has been sent" });
      });

    // } catch (err) {
    //   next(err)
    // }
  },


  verifyotp: (req, res) => {
    // try {
      if (req.body.otp == otp) {
        // res.send("You has been successfully registered");

        const newUser = UserModel(
          {
            fullName: FullName,
            userName: UserName,
            email: Email,
            phone: Phone,
            password: Password,
          }
        );
        
        let otpError = false;
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            newUser
              .save()
              .then(() => {
                res.redirect("/login");
              })
              .catch((err) => {
              
                res.redirect("/login")
              })
          })
        })

      }
      else {
        res.render('user/otp', { msg: 'otp is incorrect' });
      }

    // } catch (err) {
    //   next(err)
    // }
  },


  //***************************************** END SIGNUP USER ****************************************/


  //login
  login: async (req, res) => {
    // try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ $and: [{ email: email }, { status: "Unblocked" }] });
      let NoUser = false;
      let PwMatch = false;
      if (!user) {
        NoUser = true
      
        return res.render('user/login', { NoUser, PwMatch });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        PwMatch = true
     
        return res.render('user/login', { NoUser, PwMatch });
      }
      req.session.user = user.userName
      req.session.userId = user._id
      req.session.userLogin = true;
      res.redirect('/');

    // } catch (err) {
    //   next(err)
    // }
  },

  signup: async (req, res) => {
    let userExist = false
    res.render('user/signup', { userExist })
  },

  //forgot password start
  forgotpassword: (req, res) => {
  
    res.render('user/forgotpassword');
  },

  resetpassword: async (req, res) => {

    const userEmail = req.body;
    req.session.email = userEmail;
   
    const user = await UserModel.findOne({ $and: [{ email: userEmail.email }, { status: "Unblocked" }] });
    
    if (!user) {
      return res.redirect('/login');
    } else {
      // mail content
      var mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
      };
      
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      
        
        res.render('user/passwordotp');
       
      });
    }
  },

  verifypasswordotp: (req, res) => {
    
    if (req.body.otp == otp) {
      
      res.render('user/newpassword');
    } else {
      
      res.render('user/passwordotp');
    }
    // res.render('user/newpassword');
  },

  settingpassword: async (req, res) => {
    Pass1 = req.body.password1;
    Pass2 = req.body.password2;
   
    if (Pass1 === Pass2) {

      pass = await bcrypt.hash(Pass2, 10)
      
      existUser = req.session.email;
      const updateUser = await UserModel.updateOne({ email: existUser.email }, { $set: { password: pass } });
      
      res.redirect('/login');

    } else {
     
      res.render('user/newpassword');
    }
    

  },
  //forgot password end


  // All Product
  allproduct: async (req, res) => {
    // try {
    if (req.session.userLogin) {
      // id = req.params.id
    
      const page = parseInt(req.query.page) || 1
      const items_per_page = 9
      const totalproducts = await ProductModel.find().countDocuments()
      const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').populate('location').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
     
      const banner = await BannerModel.find()
      const brand = await BrandModel.find()
      const fuel = await FuelModel.find()
      const location = await LocationModel.find()
      const type = await TypeModel.find()
      // const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

      res.render('user/allproducts', {
        login: true,
        user: req.session.user,
        products,
        brand,
        location,
        banner,
        fuel,
        type,
        page,
        hasNextPage: items_per_page * page < totalproducts,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1,
      })
    }
    else {
      id = req.params.id
      const page = parseInt(req.query.page) || 1
      const items_per_page = 9
      const totalproducts = await ProductModel.find().countDocuments()
      const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').populate('location').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
      
      const banner = await BannerModel.find()
      const brand = await BrandModel.find()
      const fuel = await FuelModel.find()
      const location = await LocationModel.find()
      const type = await TypeModel.find()
      // const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

      res.render('user/allproducts', {
        login: false,
        products,
        brand,
        fuel,
        type,
        banner,
        location,
        page,
        hasNextPage: items_per_page * page < totalproducts,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1,
      })

    }

    // } catch (err) {
    //   next(err)
    // }

  },

  // Single Product
  singleproduct: async (req, res) => {
 


    if (req.session.userLogin) {
     

      const product = await ProductModel.findById({ _id: req.params.id }).populate('type').populate('brand').populate('fuelType').populate('location')
      
      id = req.params.id
      const newID = id
      const brand = await BrandModel.find()
      const fuel = await FuelModel.find()
      const location = await LocationModel.find()
      const type = await TypeModel.find()

      res.render('user/singleproduct', {
        login: true,
        user: req.session.user,
        product,
        location,
        brand,
        type,
        fuel
      })
    } else {
      const product = await ProductModel.findById({ _id: req.params.id }).populate('type').populate('brand').populate('fuelType').populate('location')
      
      id = req.params.id
      const brand = await BrandModel.find()
      const fuel = await FuelModel.find()
      const type = await TypeModel.find()
      const location = await LocationModel.find()
      // const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')
     
      res.render('user/singleproduct', {
        login: false,
        user: req.session.user,
        product,
        location,
        brand,
        type,
        fuel
      })

    }

   
  },
  categoryFilter: async (req, res) => {
    let login = req.session.userLogin
    let products = await TypeModel.find()

    let id = req.params.id
   
    let categoryFilter = await ProductModel.find({ type: id }).populate('type', 'typeName')
    

    if (categoryFilter) {
      res.render('user/categoryfilter', { login, products, categoryFilter })
    } else {
      res.redirect('/allproduct')
    }
  },
  brandFilter: async (req, res) => {
    let login = req.session.userLogin
    let products = await BrandModel.find()

    let id = req.params.id
   
    let brandFilter = await ProductModel.find({ brand: id }).populate('brand', 'brand')



    if (brandFilter) {
      res.render('user/brandfilter', { login, products, brandFilter })
    } else {
      res.redirect('/allproducts')
    }
  },
  fuelFilter: async (req, res) => {
    let login = req.session.userLogin
    let products = await FuelModel.find()


    let id = req.params.id
    

    let fuelFilter = await ProductModel.find({ fuelType: id }).populate('fuelType')

  

    if (fuelFilter) {
      res.render('user/fuelfilter', { login, products, fuelFilter })
    } else {
      res.redirect('/allproducts')
    }

  },
  locationFilter: async (req, res) => {
    let login = req.session.userLogin
    let products = await LocationModel.find()

    let id = req.params.id
   

    let locationFilter = await ProductModel.find({ location: id }).populate('location')



    if (locationFilter) {
      res.render('user/locationfilter', { login, products, locationFilter })
    } else {
      res.redirect('/allproducts')
    }
  },



  // Add to Wishlist
  addtowishlist: async (req, res) => {
 

    
    if (req.session.userLogin) {

      let productId = req.params.productId
      let userId = req.session.userId
      let wishlist = await Wishlist.findOne({ userId }).populate('productIds')
      
      var products = false;
   if (wishlist){
    wishlist.productIds.forEach(element => {
      if (element._id == productId) {
        products = true
      }
    });
   }
      if (products == true) {
        
        res.json({ exist: false })
      }
      else {
        if (wishlist) {
          await Wishlist.findOneAndUpdate({ userId: userId }, { $addToSet: { productIds: productId } })


          res.json({ exist: true })
          // res.redirect('/allproducts')
        }
        else {
          
          const newwishlist = new Wishlist({ userId, productIds: [productId] })
          newwishlist.save()
          // .then(() => {

          res.json({ exist: true })
          // res.redirect('/allproducts')
          // })
        }

      }




    }
    else {
      res.redirect('/login')
    }
 

  },



  // Wishlist Page
  wishlist: async (req, res) => {
    // try{

    id = req.params.id
    let userId = req.session.userId;
    
    // let login = req.session.userLogin
    // let list = await Wishlist.findOne({ userId: userId }).populate('productIds').populate('productIds.$.brand')
    let list = await Wishlist.aggregate([
      {
        '$match': {
          userId: mongoose.Types.ObjectId(userId)
        }
      },
      {
        '$unwind': {
          'path': '$productIds'
        }
      }, {
        '$lookup': {
          'from': 'productdatas',
          'localField': 'productIds',
          'foreignField': '_id',
          'as': 'result'
        }
      }, {
        '$unwind': {
          'path': '$result'
        }
      }, {
        '$lookup': {
          'from': 'branddatas',
          'localField': 'result.brand',
          'foreignField': '_id',
          'as': 'result.brand'
        }
      }, {
        '$unwind': {
          'path': '$result.brand'
        }
      }, {
        '$lookup': {
          'from': 'categorydatas',
          'localField': 'result.type',
          'foreignField': '_id',
          'as': 'result.type'
        }
      }, {
        '$unwind': {
          'path': '$result.type'
        }
      }, {
        '$lookup': {
          'from': 'fueldatas',
          'localField': 'result.fuelType',
          'foreignField': '_id',
          'as': 'result.fuelType'
        }
      }, {
        '$unwind': {
          'path': '$result.fuelType'
        }
      }, {
        '$lookup': {
          'from': 'locationdatas',
          'localField': 'result.location',
          'foreignField': '_id',
          'as': 'result.location'
        }
      }, {
        '$unwind': {
          'path': '$result.location'
        }
      },
      {
        '$project': {
          'result': 1
        }
      }
    ])
   
    if (list) {
      // let wish = list.productIds
      if (req.session.userLogin) {
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const location = await LocationModel.find()
        // const brandproducts = await productModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

        res.render("user/wishlist", {
          login: true,
          user: req.session.user,
          list,
          // brandproducts, 
          // index: 1, 
          brand,
          fuel,
          location,
          type
        })
      } else {
        res.redirect('/login')
      }
    }
  // } catch(err){
  //   next(err)
  // }

  },

  removeFromWishlist: async (req, res) => {
    // try{

    if (req.session.userLogin) {

      let productId = req.params.id
      let userId = req.session.userId;
      await Wishlist.findOneAndUpdate({ userId }, { $pull: { productIds: productId } })
        .then(() => {
          res.redirect('/wishlist')
        })
    } else {
      res.redirect('/login')
    }
  // } catch (err){
  //   next(err)
  // }


  },



  // Car Blocking Page
  carblocking: async (req, res) => {
    // try {

    if (req.session.userLogin) {

      const id = req.params.id;
      const product = await ProductModel.findOne({ _id: id })
      const brand = await BrandModel.find()
      const fuel = await FuelModel.find()
      const type = await TypeModel.find()
      const location = await LocationModel.find()
      // const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')
      const fullAmount = product.price
      const advance = product.advance

      res.render('user/carblocking', {
        login: true,
        user: req.session.user,
        // brandproducts, 
        location,
        brand,
        type,
        fuel,
        product,
        id,
        fullAmount,
        advance
      })
    }
    else {
      res.redirect('/login')
    }
    // } catch (err) {
    //   next(err)
    // }

  },

  blockCar: async (req, res) => {
    if (req.session.userLogin) {
      const id = req.params.id
      await UserModel.findOneAndUpdate({ _id: req.session.userId }, { $addToSet: { BookedVehicle: id } })
      await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: 'Blocked' } })
        .then(() => {
          res.redirect('/allproduct')
        })

    } else {
      res.redirect('/login')
    }
  },

  // Order Payment
  order: async (req, res) => {
    // try {
    if (req.session.userLogin) {
      const id = req.body.proId
     
      const amount = await ProductModel.findOne({ _id: id })

      var instance = new Razorpay({
        key_id: 'rzp_test_BZ0eXYBPSLP314',
        key_secret: '87NokHWXVj68OFe4XbTmx9FM',
      });

      instance.orders.create(
        {
          amount: (amount.advance) * 100,
          currency: "INR",
          receipt: "carz1",
        },
        function (err, order) {
          if (err) {
            
            console.log(err);
          } else {
            
            let response = {
              id, order
            }
            res.status(200).send(response);

          }
        }

      );
    }

    // } catch (err) {
    //   next(err)
    // }

  },


  // Verify Payment
  verifyorder: async (req, res) => {
    // try {
    const details = req.body
    
    const crypto = require('crypto')
    let hmac = crypto.createHmac('sha256', "87NokHWXVj68OFe4XbTmx9FM")
    hmac.update(details['payment[razorpay_order_id]'] + "|" + details['payment[razorpay_payment_id]']);
    hmac = hmac.digest('hex')

    const orderId = details['order[order][receipt]']
  
    let response = {}
    if (details['payment[razorpay_signature]'] == hmac) {
      
      // response = { status: true }
      response.status = true;
    } else {
      // response = { status: false }
      response.status = false;
      
    }
    res.send(response);
    // res.json({
    //   status:true
    // })
    // } catch (err) {
    //   next(err)
    // }
  },


  // Block Car after payment
  ordersuccess: async (req, res) => {
    // try {
    if (req.session.userLogin) {
      const userId = req.session.userId
      const id = req.params.id

      const blocked = OrderModel({
        userId: userId,
        product: id
      })


      await UserModel.findOneAndUpdate({ _id: userId }, { $addToSet: { BookedVehicles: id } })
      await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked", blockedDate: Date.now() } })

      await blocked.save()
        .then(() => {
          res.render('user/ordersuccess', {
            login: true,
            user: req.session.user
          })
        }).catch((err) => {
          
          res.render("user/orderfailed", {
            login: true,
            user: req.session.user
          });
        });

    }

    // } catch (err) {
    //   next(err)
    // }

  },

  successmail: async (req, res) => {
    const id = req.session.userId
    const User = await UserModel.find({ _id: id }).populate('email', 'email')
    const UserNoArray = User[0]
    const email = UserNoArray.email
  

    const arrLength = UserNoArray.BookedVehicles.length;
    const Id = UserNoArray.BookedVehicles[arrLength - 1]
    const productID = Id.valueOf()
    const product = await UserMailModel.find().sort({ _id: -1 }).limit(1)
    
    const usermailID = product[0]
    const productPrice = usermailID.name
    const balanceAmount = productPrice[0]

    var mailOptions = {
      to: email,
      subject: 'Booking Success',
      html: '<h3>Your Booking has been successfully done </h3>' + '<h2>Remaining Amount:' + balanceAmount + '</h2>'
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
     
    })
    res.redirect('/')
  },


  couponCheck: async (req, res) => {
    const id = req.body.product
    const product = await ProductModel.findOne({ _id: id })
    const userCoupon = req.body.coupon
    const productPrice = product.price
    const advancePrice = product.advance
    const fullAmount = req.body.fullAmount
    const advance = req.body.advance
    const dbCoupon = await CouponModel.findOne({ couponName: userCoupon })
   
    const couponId = dbCoupon._id
    const couponID = couponId.valueOf()
    if (dbCoupon) {
      const discountPercent = dbCoupon.discount
      let newAmount = (productPrice * discountPercent) / 100
      let discountMax = dbCoupon.maximum

      if (newAmount >= discountMax) {
        newAmount = discountMax
      }

      const newPrice = productPrice - newAmount - advancePrice
      const Test = new UserMailModel(
        {
          name: newPrice
        }
      )
      Test.save().then(() => {
        res.render('user/couponpage', {
          login: true,
          user: req.session.user,
          newPrice,
          advancePrice,
          id,
          product,
        })
      })
        .catch((err) => {
         
          res.redirect('/')
        })

    }
    else {
      // const brand =await BrandModel.find()
      // const fuel = await FuelModel.find()
      // const type= await TypeModel.find()
      res.render('user/carblocking', {
        login: true,
        user: req.session.user,
        product,
        id,
        fullAmount,
        advance
      })

    }
  },
  blockedcarpage: async (req, res) => {
    // try{

    if (req.session.userLogin) {
      const id = req.params.id
      const userId = req.session.userId
      const cars = await UserModel.aggregate([
        {
          '$match': {
            _id: mongoose.Types.ObjectId(userId)
          }
        },
        {
          '$unwind': {
            'path': '$BookedVehicles'
          }
        }, {
          '$lookup': {
            'from': 'productdatas',
            'localField': 'BookedVehicles',
            'foreignField': '_id',
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result'
          }
        }, {
          '$lookup': {
            'from': 'branddatas',
            'localField': 'result.brand',
            'foreignField': '_id',
            'as': 'result.brand'
          }
        }, {
          '$unwind': {
            'path': '$result.brand'
          }
        }, {
          '$lookup': {
            'from': 'categorydatas',
            'localField': 'result.type',
            'foreignField': '_id',
            'as': 'result.type'
          }
        }, {
          '$unwind': {
            'path': '$result.type'
          }
        }, {
          '$lookup': {
            'from': 'fueldatas',
            'localField': 'result.fuelType',
            'foreignField': '_id',
            'as': 'result.fuelType'
          }
        }, {
          '$unwind': {
            'path': '$result.fuelType'
          }
        }, {
          '$lookup': {
            'from': 'locationdatas',
            'localField': 'result.location',
            'foreignField': '_id',
            'as': 'result.location'
          }
        }, {
          '$unwind': {
            'path': '$result.location'
          }
        },
        {
          '$project': {
            'result': 1
          }
        }
      ])
     
      if (cars) {
        res.render('user/blockedcars', {
          login: true,
          user: req.session.user,
          cars,
          index: 1
        })
      } else {
        res.redirect('/login')
      }
    }
  // } catch(err){
  //   next(err)
  // }

  },
  profile: async (req, res) => {
    // try{

    if (req.session.userLogin) {
      const id = req.session.userId
      const userDetails = await UserModel.findById({ _id: id })
      res.render('user/profile', {
        login: true,
        user: req.session.user,
        userDetails,
      })
    } else {
      res.redirect('/login')
    }
  // } catch(err){
  //   next(err)
  // }

  },

  editprofilepage: async (req, res) => {
    // try{

    if (req.session.userLogin) {
      const id = req.params.id
      let profile = await UserModel.findById({ _id: id })
      res.render('user/editprofile', {
        login: true,
        user: req.session.user,
        profile,
      })
    } else {
      res.redirect('/login')
    }
  // } catch(err){
  //   next(err)
  // }

  },

  updateprofile: async (req, res) => {
   

    if (req.session.userLogin) {
      const { fullName, userName, email, phone } = req.body
      let details = await UserModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { fullName, userName, email, phone } })
      await details.save()
        .then(() => {
          res.redirect('/profile')
        })
    } else {
      res.redirect('/login')
    }
 
  },
  
  search: async (req, res) => {
    const searchQuery = req.body.search
    
    // const searchString = ''+searchQuery
   
    // const page =parseInt(req.query.page) || 1
    // const items_per_page=9
    // const totalproducts = await ProductModel.find().countDocuments()
    const search = await ProductModel.find({ productName: { $regex: searchQuery, '$options': 'i' } })
    
    // const category=await categoryModel.find()
    const banner = await BannerModel.find()
    const brand = await BrandModel.find()
    const fuel = await FuelModel.find()
    const location = await LocationModel.find()
    const type = await TypeModel.find()

   
    const searchlen = search.length
    if (req.session.userLogin) {
      res.render('user/search', {
        login: true,
        user: req.session.user,
        search,
        // category,
        banner,
        brand,
        fuel,
        location,
        type,
        searchQuery
      })
    } else {
      res.render('user/search', {
        login: false,
        user: req.session.user,
        search,
        // category,
        banner,
        brand,
        fuel,
        location,
        type,
        searchQuery,
        searchlen
      })
    }


  },

  logout: (req, res) => {
  
    req.session.loggedOut = true;
    req.session.destroy()
    res.redirect('/')
    
  },

}
