const routeModel = require('../models/routeModel')

const getRoutes = async (req, res) => {
    try {
        let result = await routeModel.find()
            .sort('origin')
        if (result.length < 1)
            result = 'empty'
        res.json({ message: 'Route list page', result })
    } catch (error) {
        console.log(error)
        return
    }
}
const addRoutes = async (req, res) => {
    const data = req.body
    try {
        const result = await routeModel.create(data)
        if (result) {
            return res.status(200).json({ message: 'added successfully', data: result });
        }
    } catch (error) {
        console.log('error : ' + error)
        return
    }
}
const deleteRoute = async (req, res) => {
    const routeId = req.params.id
    try {
        const result = await routeModel.findByIdAndDelete(routeId)
        if (result) { console.log('success') }
        else { console.log('not working') }
    } catch (error) {
        console.log(error)
        return
    }
}
module.exports = { getRoutes, addRoutes, deleteRoute }