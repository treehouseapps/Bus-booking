const ticketModel = require('../models/ticketModel');

const getTickets = async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login')
        return
    }

    try {
        const tickets = await ticketModel.find({ userId: req.session.user._id });
        res.render('ticket', { tickets });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).send("Server error");
    }
};
const addTicket = async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login')
        return
    }

    try {
        const { userId, name } = req.session.user
        consol.log(req.session.user)
        consol.log(req.body)
        const { origin, destination, startingTime, arrivingTime, price, km, date, busType } = req.body;

        const newTicket = await ticketModel.create({
            userId, name, origin, destination, startingTime, arrivingTime, price, km, date, busType
        });

        res
            .res.redirect('/');

        return
    } catch (error) {
        console.error('Error creating ticket:', error.message);
        res.status(500).send('Server error');
    }
};

module.exports = { getTickets, addTicket };
