const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema"
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },
    language: {
        type: String,
        required: true,
        trim: true
    },
    specificDate: {
        type: Date,
        // required: true,
    },
    seats: [
        {
            seat: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seat"
            }
        }
    ]
}, {
    timestamps: true
})


const Show = mongoose.model('Show', showSchema)

module.exports = Show