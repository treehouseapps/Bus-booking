const busModel = require('../models/busModel')
const routeModel = require('../models/routeModel')
const ticketModel = require('../models/ticketModel');

const booking = async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/login')
            return
        }
        const routeId = req.params.id
        const route = await routeModel.findById(routeId)
        if (!route) {
            return res.status(404).send('Route not found')
        }
        const busType = route.busType

        const bus = await busModel.find({ busType, status: 'available' })
        if (bus.length === 0) {
            return res.status(404).send('No available buses of this type');
        }
        res.render('booking', {
            route,
            bus: bus[0]
        })
    } catch (error) {
        console.log(error)
        return
    }
}
const getBus = async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login')
        return
    }

    try {
        const data = await busModel.find({ status: 'available' }).sort('name')
        res.render('bus', { data, session: req.session.user.role })
    }
    catch {
        res.json('empty')
    }
}
const addBus = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.redirect('/login')
        return
    }

    const createBus = async () => {
        const { seatCount, busType, status } = req.body
        const seats = [];

        for (let i = 1; i <= seatCount; i++) {
            seats.push({
                seatNumber: i,
                isReserved: false,
                reservedBy: null
            });
        }

        const newBus = new busModel({
            busType,
            status: 'available',
            seatsAvailable: seats
        });

        try {
            await newBus.save();
            res.redirect('/admin/bus')
        } catch (err) {
            console.error('Error creating bus:', err.message);
        }
    };
    createBus()
}
const deleteBus = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.redirect('/login')
        return
    }

    const busId = req.params.id
    try {
        const result = await busModel.findByIdAndDelete(busId)
        if (result) {
            res.redirect('/admin/bus')
            return
        }
        else { console.log('not working') }
    } catch (error) {
        console.log(error)
        return
    }
}
const reserveSeat = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.redirect('/login')
        return
    }

    const busId = req.params.id
    const tempSeat = req.body.seatNumber
    const card = req.body.cardNumber
    try {
        const bus = await busModel.findById(busId)
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        const reserve = bus.seatsAvailable.find(seat => {
            return seat.seatNumber === Number(tempSeat);
        });
        if (!reserve) return res.status(404).json({ message: 'Seat not found' });
        if (reserve.isReserved) { return res.status(400).json({ message: 'Seat already reserved' }) }

        reserve.isReserved = true;
        reserve.reservedBy = req.session.user;
        await bus.save();

        // After saving, check if the bus is now full
        const isBusFull = bus.seatsAvailable.every(seat => seat.isReserved);

        if (isBusFull) {
            bus.status = 'full';
            await bus.save();
        }
        //addins reports
        const { name } = req.session.user
        const { origin, destination, startingTime, arrivingTime, price, km, busType, cardNumber, seatNumber } = req.body;

        const newTicket = await ticketModel.create({
            userId: req.session.user._id, name, origin, destination, startingTime, arrivingTime, price, km, date: new Date(), busType, cardNumber: card, seatNumber
        });

        res.redirect('/');

    } catch (error) {
        console.log(error)
        return
    }
}
module.exports = { addBus, getBus, booking, deleteBus, reserveSeat }