const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    origin: { type: String, requird: true },
    destination: { type: String, requird: true },
    busType: { type: String, required: true },
    price: { type: Number, required: true },
    km: { type: Number, required: true },
    startingTime: { type: String, required: true },
    arrivingTime: { type: String, required: true }
})

const model = mongoose.model('route', routeSchema)

module.exports = model