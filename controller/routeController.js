const routeModel = require('../models/routeModel')
const busModel = require('../models/busModel')

const getRoutes = async (req, res) => {
    try {
        let result = await routeModel.find()
            .sort('origin')

        res.render('index', { routes: result, session: req.session.user ? req.session.user.role : null })

    } catch (error) {
        console.log(error)
        return
    }
}

const addRoutes = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.redirect('/login')
        return
    }

    try {
        const result = await routeModel.create(req.body);
        res.redirect('/');
    } catch (error) {
        console.log('error : ' + error);
        res.status(500).send('Server error');
    }
};

const addItems = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.redirect('/login')
        return
    }

    try {
        const result = await busModel.find()
        if (result) {
            res.render('addItems', { buses: result })
        }
    } catch (error) {
        console.log('error : ' + error)
        return
    }
}
const deleteRoute = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.redirect('/login')
        return
    }

    const routeId = req.params.id
    try {
        const result = await routeModel.findByIdAndDelete(routeId)
        if (result) {
            res.redirect('/')
            return
        }
        else { console.log('not working') }
    } catch (error) {
        console.log(error)
        return
    }
}
module.exports = { getRoutes, addRoutes, addItems, deleteRoute }