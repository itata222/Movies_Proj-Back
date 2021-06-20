const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
})


const Review = mongoose.model('Review', reviewSchema)

module.exports = Review