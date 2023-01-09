const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    couponName: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    maximum: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    }
})

module.exports = CouponModel = mongoose.model('CouponData', couponSchema)