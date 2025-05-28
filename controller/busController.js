const busModel = require('../models/busModel')
const routeModel = require('../models/routeModel')

const booking = async (req, res) => {
    try {
        const routeId = req.params.id
        const route = await routeModel.findById(routeId)

        // if (!route) {
        //     return res.status(404).send('Route not found')
        // }
        // const bus = route.bus

        res.render('booking', {
            seatCount: bus.seatsAvailable.length,
            route,
            bus
        })
    } catch (error) {
        console.log(error)
        return
    }
}
const getBus = async (req, res) => {
    try {
        const data = await busModel.find({ status: 'available' }).sort('name')
        res.render('bus', { data })
    }
    catch {
        res.json('empty')
    }
}
const addBus = async (req, res) => {
    const createBus = async () => {
        const { totalSeats, busType, status } = req.body
        const seats = [];

        for (let i = 1; i <= totalSeats; i++) {
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
            res.redirect('/')
        } catch (err) {
            console.error('Error creating bus:', err.message);
        }
    };
    createBus()
}
const deleteBus = async (req, res) => {
    const busId = req.params.id
    try {
        const result = await busModel.findByIdAndDelete(busId)
        if (result) { console.log('success') }
        else { console.log('not working') }
    } catch (error) {
        console.log(error)
        return
    }
}
const reserveSeat = async (req, res) => {
    console.log(req.params.id, req.body.seatNumber)
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
            console.log('full')
        }

        res.redirect('/')
    } catch (error) {
        console.log(error)
        return
    }
}
module.exports = { addBus, getBus, booking, deleteBus, reserveSeat }