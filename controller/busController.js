const busModel = require('../models/busModel')

const getBus = async (req, res) => {
    try {
        let result = await busModel.find()
        if (result.length < 1)
            result = 'empty'
        res.json({ message: 'Buss list page', result })
    } catch (error) {
        console.log(error)
        return
    }
}
const addBus = async (req, res) => {
    // const { busId, busType, seatsAvailable } = req.body
    // try {
    //     const result = await busModel.create({ busId, busType, seatsAvailable })
    //     if (result) {
    //         return res.status(200).json({ message: 'added successfully', data: result });
    //     }
    // } catch (error) {
    //     console.log('error : ' + error)
    //     return
    // }
    const createBus = async () => {
        const totalSeats = 4;
        const seats = [];

        for (let i = 1; i <= totalSeats; i++) {
            seats.push({
                seatNumber: i,
                isReserved: false,
                reservedBy: null
            });
        }

        const newBus = new busModel({
            busType: 'Airbus',
            seatsAvailable: seats
        });

        try {
            await newBus.save();
            console.log('Bus created with 4 seats');
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
    const busId = req.params.id
    const tempSeat = req.body.seat
    try {
        const bus = await busModel.findById(busId)
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        const reserve = await bus.seatsAvailable.find(seat => seat.seatNumber === tempSeat)
        if (!reserve) return res.status(404).json({ message: 'Seat not found' });
        if (reserve.isReserved) { return res.status(400).json({ message: 'Seat already reserved' }) }

        reserve.isReserved = true;
        reserve.reservedBy = req.body.userId;
        await bus.save();

        res.status(200).json({ message: 'Seat reserved successfully' });
    } catch (error) {
        console.log(error)
        return
    }
}
module.exports = { addBus, getBus, deleteBus, reserveSeat }