const mongoose = require('mongoose')
const locationSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    }
})


module.exports = LocationModel = mongoose.model('LocationData', locationSchema)