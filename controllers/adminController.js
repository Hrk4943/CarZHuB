const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const BrandModel = require("../models/brandModel");
const TypeModel = require("../models/categoryModel")
const FuelModel = require('../models/fuelModel')
const LocationModel=require('../models/locationModel')
const BannerModel = require("../models/bannerModel")
const CouponModel = require("../models/couponModel")


const bcrypt = require("bcrypt");
const OrderModel = require("../models/orderModel");
const couponModel = require("../models/couponModel");
// const sharp = require("sharp");


module.exports = {

    //-------------------------------------------------------------------------------------------------
    // RENDING PAGES



    //admin home page
    home: async (req, res) => {
        // try {
            const users = await UserModel.find().countDocuments()
            const products = await ProductModel.find().countDocuments()
            const sold = await ProductModel.find({ sold: 'Sold' }).countDocuments()
            const blocked = await ProductModel.find({ status: 'Blocked' }).countDocuments()
            const Brand = await BrandModel.find().countDocuments()
            const Type = await TypeModel.find().countDocuments()
            const Fuel = await FuelModel.find().countDocuments()
            const Banner = await BannerModel.find().countDocuments()
            // const Coupen = await coupenModel.find().countDocuments()
            res.render('admin/home', { 
                admin: req.session.admin, 
                users, 
                products, 
                sold, 
                blocked, 
                Brand,
                Type, 
                Fuel, 
                Banner,
                //  Coupen 
                })
        // } catch (err) {
        //     next(err)
        // }

    },

    //login page
    admin: (req, res) => {
        // try {
            if (!req.session.adminLogin) {
                res.render('admin/login')
            } else {
                res.redirect('/admin/adminhome')
            }
        // } catch (err) {
        //     next(err)
        // }

    },



    //-------------------------------------------------------------------------------------------------

    //login
    adminlogin: async (req, res) => {
        // try {
            const { email, password } = req.body;
            const admin = await AdminModel.findOne({ email });
            if (!admin) {
                return res.redirect('/admin');
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                console.log('wrong password');
                return res.redirect('/admin');
            }
            req.session.adminLogin = true;
            req.session.admin = admin.userName
            res.redirect('/admin/adminhome');

        // } catch (err) {
        //     next(err)
        // }
    },
     //add user page
     adduserpage: (req, res) => {
        // try {
            res.render('admin/adduser', { admin: req.session.admin })
        // } catch (err) {
        //     next(err)
        // }
    },

    //add user
    adduser: (req, res) => {
        // try {
            const newUser = UserModel(req.body
                
            );
            console.log(req.body);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(() => {
                            res.redirect("/admin/alluser");
                        })
                        .catch((err) => {
                            console.log(err);
                            res.redirect("/admin/alluser")
                        })
                })
            })
        // } catch (err) {
        //     next(err)
        // }

      
    },
     //view all user
     alluser: async (req, res) => {
        // try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 10;
            const totalusers = await UserModel.find().countDocuments()
            console.log(totalusers);
            const users = await UserModel.find({}).sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            res.render('admin/viewuser', {
                users, index: 1, admin: req.session.admin,
                page,
                hasNextPage: items_per_page * page < totalusers,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })

        // } catch (err) {
        //     next(err)
        // }

    },

    // Block and Unblock Users
    blockUser: async (req, res) => {
        // try {
            const id = req.params.id
            await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
                .then(() => {
                    res.redirect('/admin/alluser')
                })

        // } catch (err) {
        //     next(err)
        // }
    },

    unblockUser: async (req, res) => {
        // try {
            const id = req.params.id
            await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Unblocked" } })
                .then(() => {
                    res.redirect('/admin/alluser')
                })

        // } catch (err) {
        //     next(err)
        // }
    },

     //add product page
     addproductpage: async (req, res) => {
        // try {
            if (req.session.adminLogin) {
                const type = await TypeModel.find()
                const brand = await BrandModel.find()
                const fuel = await FuelModel.find()
                const location= await LocationModel.find()

                res.render('admin/addproduct', { type, brand, fuel, location,admin: req.session.admin })

            }

        // } catch (err) {
        //     next(err)
        // }
    },

    //add products
    addproduct: async (req, res) => {
       


        const { type, brand, fuelType,location, productName, description,year,km,owner, price, advance } = req.body;

        console.log(brand,'asdasdsdassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');

        const image = req.files;
        image.forEach(img => { });
        // console.log(image);
        const productimages = image != null ? image.map((img) => img.filename) : null
        // console.log(productimages)

        const newProduct = ProductModel({
            type,
            brand,
            fuelType,
            location,
            productName,
            description,
            year,
            km,
            owner,
            price,
            advance,
            // image: image.filename,
            image: productimages
        });





        

        await newProduct
            .save()
            .then(() => {
                res.redirect("/admin/allproduct");
            }).catch((err) => {
                console.log(err.message);
                res.redirect("/admin/addproduct");
            });

      

    },

    //view all products
    viewproduct: async (req, res) => {
        // try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 5;
            const totalproducts = await ProductModel.find().countDocuments()
            // console.log(totalproducts);
            const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').populate('location').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            // console.log(products)
            res.render('admin/viewproduct', {
                products, index: 1, admin: req.session.admin, page,
                hasNextPage: items_per_page * page < totalproducts,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })

        // } catch (err) {
        //     next(err)
        // }

    },

    // Delete Product
    deleteproduct: async (req, res) => {
        // try {
            let id = req.params.id;
            await ProductModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/allproduct")

        // } catch (err) {
        //     next(err)
        // }
    },

    //edit product page
    editproductpage: async (req, res) => {
        // try {
            if (req.session.adminLogin) {
                const id = req.params.id
                const type = await TypeModel.find()
                const brand = await BrandModel.find()
                const fuel = await FuelModel.find()
                const location=await LocationModel.find()
                let product = await ProductModel.findOne({ _id: id }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').populate('location')
                console.log(product)
                res.render('admin/editproduct', { product, type,location, brand, fuel, admin: req.session.admin })
            }

        // } catch (err) {
        //     next(err)
        // }

    },

    // Update Product
    updateProduct: async (req, res) => {
        // try {
            const { type, brand, fuelType, location,productName, description,year,km,owner, price, advance } = req.body;

            if (req.file) {
                // await ProductModel.findByIdAndUpdate(
                //     { _id: req.params.id }, { $set: { image: image.filename } }
                // );
                const image = req.files;
                image.forEach(img => { });
                console.log(image);
                const productimages = image != null ? image.map((img) => img.filename) : null
                console.log(productimages)

                await ProductModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { image: productimages } })
            }
            let details = await ProductModel.findOneAndUpdate(
                { _id: req.params.id }, { $set: { type, brand, fuelType, location,productName, description,year,km,owner, price, advance } }
            );
            await details.save().then(() => {
                res.redirect('/admin/allproduct')
            })

        // } catch (err) {
        //     next(err)
        // }
    },


     // sold car page
     soldcarpage: async (req, res) => {
        // try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 5;
            const totalsoldproducts = await ProductModel.find({ sold: 'Sold' }).countDocuments()
            console.log(totalsoldproducts);
            const products = await ProductModel.find({ sold: 'Sold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            console.log(products)
            res.render('admin/soldcar', {
                products, index: 1, admin: req.session.admin, page,
                hasNextPage: items_per_page * page < totalsoldproducts,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })

        // } catch (err) {
        //     next(err)
        // }

    },

    //====================================================================================================================

    // Blocked car page
    blockedcarpage: async (req, res) => {
        // try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 5;
            const totalblockedproducts = await ProductModel.find({ status: 'Blocked' }).countDocuments()
            console.log(totalblockedproducts);
            const products = await ProductModel.find({ status: 'Blocked', sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ blockedDate: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            console.log(products)
            res.render('admin/blockedcars', {
                products, index: 1, admin: req.session.admin, page,
                hasNextPage: items_per_page * page < totalblockedproducts,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })

        // } catch (err) {
        //     next(err)
        // }

    },

    //====================================================================================================================

    // UnBlock Car
    unblockCar: async (req, res) => {
        // try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Unblocked" } })
                .then(() => {
                    res.redirect('/admin/allproduct')
                })

        // } catch (err) {
        //     next(err)
        // }
    },

    // Block car
    blockCar: async (req, res) => {
        // try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
                .then(() => {
                    res.redirect('/admin/allproduct')
                })

        // } catch (err) {
        //     next(err)
        // }
    },

    //====================================================================================================================

    // Sold Car
    soldCarp: async (req, res) => {
        // try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { sold: "Sold" } })
                .then(() => {
                    res.redirect('/admin/allproduct')
                })

        // } catch (err) {
        //     next(err)
        // }
    },

    // Sold Car
    soldCarb: async (req, res) => {
        // try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { sold: "Sold" } })
                .then(() => {
                    res.redirect('/admin/blockedcars')
                })

        // } catch (err) {
        //     next(err)
        // }
    },

    // Not Sold Car
    notsoldCar: async (req, res) => {
        // try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { sold: "Notsold" } })
                .then(() => {
                    res.redirect('/admin/soldcar')
                })

        // } catch (err) {
        //     next(err)
        // }
    },


    //====================================================================================================================

    // BRAND
    brandpage: async (req, res) => {
        // try {
            const brand = await BrandModel.find({});
            res.render('admin/brand', { brand, admin: req.session.admin })

        // } catch (err) {
        //     next(err)
        // }
    },
    // NEW BRAND
    addBrand: (req, res) => {
        // try {
            const brand = req.body.brand;
            const newBrand = BrandModel({ brand });
            newBrand.save().then(res.redirect('/admin/brandpage'))

        // } catch (err) {
        //     next(err)
        // }
    },
    // DELETE BRAND
    deletebrand: async (req, res) => {
        // try {
            let id = req.params.id;
            // console.log("delete")
            await BrandModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/brandpage")

        // } catch (err) {
        //     next(err)
        // }
    },

    //====================================================================================================================

    // VEHICLE TYPE
    categorypage: async (req, res) => {
        // try {
            const typeName = await TypeModel.find({});
            res.render('admin/category', { typeName, admin: req.session.admin })

        // } catch (err) {
        //     next(err)
        // }
    },
    // NEW VEHICLE TYPE
    addcategory: (req, res) => {
        // try {
            const typeName = req.body.typeName;
            const newCategory = TypeModel({ typeName });
            newCategory.save().then(res.redirect('/admin/category'))

        // } catch (err) {
        //     next(err)
        // }
    },
    // DELETE VEHICLE
    deletecategory: async (req, res) => {
        // try {
            let id = req.params.id;
            // console.log("delete")
            await TypeModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/category")

        // } catch (err) {
        //     next(err)
        // }
    },

    //====================================================================================================================

    // FUEL TYPE
    fueltypepage: async (req, res) => {
        // try {
            const fuelType = await FuelModel.find({});
            res.render('admin/fuel', { fuelType, admin: req.session.admin })

        // } catch (err) {
        //     next(err)
        // }
    },
    // NEW FUEL
    addfuel: (req, res) => {
        // try {
            const fuelType = req.body.fuelType;
            const newfuel = FuelModel({ fuelType });
            newfuel.save().then(res.redirect('/admin/fuel'))

        // } catch (err) {
        //     next(err)
        // }
    },
    // DELETE FUEL TYPE
    deletefuel: async (req, res) => {
        // try {
            let id = req.params.id;
            // console.log("delete")
            await FuelModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/fuel")

        // } catch (err) {
        //     next(err)
        // }
    },


     //------------------Location---------------------------//
     location: async (req, res) => {
        const location = await LocationModel.find({})
    
        res.render('admin/location', { location,admin: req.session.admin})
    },        


    addlocation: async(req, res) => {
        const location = req.body.location
        
        const newLocation =await LocationModel({ location })
        
        newLocation.save().then(res.redirect('/admin/location'))
    },

    deletelocation: async (req, res) => {
        let id = req.params.id
        await LocationModel.findByIdAndDelete({ _id: id })
        res.redirect('/admin/location')
    },   


    
    allBanner: async (req, res) => {
        // try {
            const banners = await BannerModel.find({})
            console.log(banners)
            res.render('admin/viewBanner', { banners, index: 1, admin: req.session.admin })

        // } catch (err) {
        //     next(err)
        // }
    },

    addBannerPage: async (req, res) => {
        // try {
            res.render('admin/addBanner', { admin: req.session.admin })

        // } catch (err) {
        //     next(err)
        // }
    },

    addBanner: async (req, res) => {
        // try {
            const { bannerName, description } = req.body

            const image = req.files;
            image.forEach(img => { });
            console.log(image);
            const bannerimages = image != null ? image.map((img) => img.filename) : null

            const newBanner = BannerModel({
                bannerName,
                description,
                image: bannerimages,
            });
            console.log(newBanner)

            await newBanner
                .save()
                .then(() => {
                    res.redirect("/admin/allBanner");
                })
                .catch((err) => {
                    console.log(err.message);
                    res.redirect("/admin/addBannerPage");
                });

        // } catch (err) {
        //     next(err)
        // }

    },

    deletebanner: async (req, res) => {
        // try {
            let id = req.params.id;
            await BannerModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/allBanner")

        // } catch (err) {
        //     next(err)
        // }

    },

    Coupon:async(req,res)=>{
        const coupon=await CouponModel.find({}).then((data)=>{
            console.log(data);
            let coupon=data
            res.render('admin/coupon',{
                coupon,
                index:1,
                admin:req.session.admin
            })
        })
    },
    addCouponpage:async(req,res)=>{
        res.render('admin/addcoupon',{
            admin:req.session.admin
        })
    },
    addCoupon:async(req,res)=>{
        const{couponName,discount,maximum}=req.body
        const newCoupon= CouponModel({
            couponName,
            discount,
            maximum
        })
        console.log(newCoupon);
        await newCoupon.save().then(()=>{
            res.redirect('/admin/allcoupon')
        })
    },
    deleteCoupon:async(req,res)=>{
        let id=req.params.id
        await CouponModel.findByIdAndDelete({_id:id})
        res.redirect('/admin/allcoupon')
    },





    logout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy()
        res.redirect('/admin')
    }


}