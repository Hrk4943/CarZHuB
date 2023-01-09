
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('./config/connection');
const session = require('express-session');
const multer = require('multer')



const homeRoute = require("./routes/User");
const adminRoute = require("./routes/Admin.js");





const app = express();

// set view engine
app.set('views', path.join(__dirname, '/views'))  //or
// app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
mongoose.connect()

// app.use('/images', express.static(path.join(__dirname, 'images')))
// app.use(multer({dest: 'images'}).single('image'))



// Multer (file upload setup)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/cars/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
        console.log(file.fieldname + Date.now() + path.extname(file.originalname));
    },
});
app.use(multer({ dest: "public/images/cars",storage: storage }).array("image", 10))




//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
}
))

//CACHE CONTROL
app.use((req, res, next) => {
    res.set("Cache-Control", "private,no-cache,no-store,must-revalidate");
    next();
})


//User route
app.use("/", homeRoute);

// Admin route
app.use("/admin", adminRoute);

//Error route
// app.use(function (err, req, res, next) {
//     console.log("admin error route handler")
//     res.status(err.status || 500);
//     res.render('error/error');
// });

//start server
app.listen(8000, () => {
    console.log('server started at port 8000');
})