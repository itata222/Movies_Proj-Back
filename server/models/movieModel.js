const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        trim: true
    },
    reviews: [
        {
            review: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        }
    ]
}, {
    timestamps: true
})


const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie