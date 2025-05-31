const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const routes = require('./routes/routes')
const connection = require('./config/connection')
const path = require('path');
const session = require('express-session');
const MongoStore = require("connect-mongo");


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DBCONNECTION }),
    cookie: { maxAge: 1000 * 60 * 60 * 1 }
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

connection()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes)
app.use((req, res) => {
    res.redirect('/');
});
app.use(cors)
app.listen(process.env.PORT, () => {
    console.log(`backend server running in port ${process.env.PORT}....`)
})