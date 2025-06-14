const express = require('express')
const userModel = require('../models/userModel')
const app = express()
const { registerPage, signInPage, adminRegisterPage, adminSignup, login, signUp } = require('../controller/userController')
const { getRoutes, addRoutes, addItems, deleteRoute } = require('../controller/routeController')
const { addBus, getBus, booking, deleteBus, reserveSeat } = require('../controller/busController')
const { getTickets, addTicket } = require('../controller/ticketController')

//user
app.get('/register', registerPage)
app.post('/signup', signUp)

app.get('/login', signInPage)
app.post('/login', login)
//admin
app.get('/admin/register', adminRegisterPage)
app.post('/admin/signup', adminSignup)

app.get('/', getRoutes)
app.get('/admin/add', addItems)
app.post('/admin/addroutes', addRoutes)
app.post('/admin/addbus', addBus)
app.get('/admin/bus', getBus)
app.get('/book/:id', booking)
app.get('/admin/deleteroute/:id', deleteRoute)
app.get('/admin/deletebus/:id', deleteBus)
app.post('/reserveseat/:id', reserveSeat)
app.get('/tickets', getTickets)
app.post('/addreport', addTicket)
app.get('/admin', (req, res) => {
    res.render('adminDashboard', { session: req.session.user ? req.session.user : null })
})
app.get('/admin/users', async (req, res) => {
    try {
        const data = await userModel.find().sort('role')
        res.render('users', { data, session: req.session.user ? req.session.user : null })
    }
    catch {
        res.json('empty')
    }
})
app.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await userModel.findByIdAndDelete(id)
        if (data)
            res.redirect('/admin/users')
    }
    catch {
        res.json('Can not delete user')
    }
})
app.get('/destroy', async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Failed to log out.');
            }
            res.redirect('/login');
        });
    }
    catch {
        res.json('Can not clear session')
    }
})


module.exports = app;