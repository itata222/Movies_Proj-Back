const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isTaken: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})


const Seat = mongoose.model('Seat', seatSchema)

module.exports = Seat