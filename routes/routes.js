const express = require('express')
const userModel = require('../models/userModel')
const routeModel = require('../models/routeModel')
const busModel = require('../models/busModel')
const app = express()
const { registerPage, signInPage, adminRegisterPage, adminSignup, login, signUp } = require('../controller/userController')
const { getRoutes, addRoutes, addItems, deleteRoute } = require('../controller/routeController')
const { addBus, getBus, booking, deleteBus, reserveSeat } = require('../controller/busController')

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
app.post('/addroutes', addRoutes)
app.post('/addbus', addBus)
app.get('/admin/bus', getBus)
app.get('/admin/bus', getBus)
app.get('/book/:id', booking)
app.get('/deleteroute/:id', deleteRoute)
app.get('/deletebus/:id', deleteBus)
app.post('/reserveseat/:id', reserveSeat)
app.get('/admin', (req, res) => {
    res.render('adminDashboard')
})
app.get('/admin/users', async (req, res) => {
    try {
        const data = await userModel.find().sort('role')
        res.render('users', { data })
    }
    catch {
        res.json('empty')
    }
})
app.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        // const data = await userModel.findByIdAndDelete(id)
        const data = await routeModel.findByIdAndDelete(id)
        // const data = await busModel.findByIdAndDelete(id)
        if (data)
            res.json("Deleted Successfully")
    }
    catch {
        res.json('Can not delete user')
    }
})
module.exports = app;