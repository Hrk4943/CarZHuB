const mongoose = require('mongoose')




module.exports.connect = function () {
    mongoose.connect('mongodb+srv://hrithik:1234@cluster0.9zdghzn.mongodb.net/cluster0?retryWrites=true&w=majority', () => {
        console.log('Connected to Database');
    })
}
