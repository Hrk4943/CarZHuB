const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const productSchema = new mongoose.Schema({
    type: {
        type: Objectid,
        required: true,
        ref: "CategoryData"
    },
    brand: {
        type: Objectid,
        required: true,
        ref: "BrandData"
    },
    fuelType: {
        type: Objectid,
        required: true,
        ref: "FuelData"
    },
    location:{
        type:Objectid,
        required:true,
        ref:"LocationData"
    },
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    year:{
        type:Number,
        required:true,
    },
    km:{
        type:Number,
        required:true,
    },
    owner:{
        type:Number,
        required:true,
    },
    price: {
        type: Number,
        required: true
    },
    advance: {
        type: Number,
        required: true
    },
    image: {
        type: [String],
        
    },
    status: {
        type: String,
        default: 'Unblocked'
    },
    sold: {
        type: String,
        default: 'Notsold'
    },
    date: {
        type: Date,
        default: Date.now
    },
    blockedDate: {
        type: Date,
        default: Date.now
    },




})

module.exports = ProductModel = mongoose.model('ProductData', productSchema);