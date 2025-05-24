const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const routes = require('./routes/routes')
const connection = require('./config/connection')

connection()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes)
app.use(cors)
app.listen(process.env.PORT, () => {
    console.log(`backend server running in port ${process.env.PORT}....`)
})