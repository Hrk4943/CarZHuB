const mongoose = require('mongoose')

const UserMailSchema = new mongoose.Schema({
    name: {
        type: Array,
        required: true
    }
})

module.exports = UserMailModel = mongoose.model('UserMail', UserMailSchema)