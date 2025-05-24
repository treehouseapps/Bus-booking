const mongoose = require('mongoose')

async function connection() {
    try {
        const result = await mongoose.connect(process.env.DBCONNECTION);
        if (result) {
            console.log('Database Connected');
        }
    } catch (err) {
        console.log("Database Connection Error:\n\n" + err);
        return
    }
}

module.exports = connection