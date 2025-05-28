const mongoose = require('mongoose')
const busSchema = new mongoose.Schema({
    busType: { type: String, required: true },
    status: { type: String, required: true },
    seatsAvailable: [{
        seatNumber: { type: Number, required: true },
        isReserved: { type: Boolean, default: false },
        reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    }]
})

const model = mongoose.model('bus', busSchema)

module.exports = model