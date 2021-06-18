const mongoose = require('mongoose')

const cinemaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,

    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    shows: [
        {
            show: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Show"
            }
        }
    ]
}, {
    timestamps: true
})


const Cinema = mongoose.model('Cinema', cinemaSchema)

module.exports = Cinema