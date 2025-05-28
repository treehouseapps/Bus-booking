const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Id is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    busType: {
        type: String,
        required: [true, "Bus type is required"],
    },
    origin: {
        type: String,
        required: [true, "Origin is required"],
    },
    destination: {
        type: String,
        required: [true, "Destination is required"],
    },
    startingTime: {
        type: String,
        required: [true, "Starting time is required"],
    },
    arrivingTime: {
        type: String,
        required: [true, "Arriving time is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    seatNumber: {
        type: String,
        required: [true, "Seat number is required"],
    },
    cardNumber: {
        type: String,
        required: [true, "Card number is required"],
    },
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
