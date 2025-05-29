const bcrypt = require("bcryptjs");
const userModel = require('../models/userModel')

const signInPage = (req, res) => {
    res.render('login', { session: req.session.user ? req.session.user : null })
}
const registerPage = (req, res) => {
    res.render('register', { session: req.session.user ? req.session.user : null })
}
const adminRegisterPage = (req, res) => {
    res.render('adminRegister', { session: req.session.user ? req.session.user : null })
}
// Admin signup logic
const adminSignup = async (req, res) => {
    try {
        const { name, email, password, secret } = req.body;
        if (!name || !email || !password || !secret) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (secret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: "Invalid secret code" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.redirect('/')

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            role: 'user'
        });

        res.redirect('/')
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "User Not Existed" });

        // Compare passwords

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password is Not Match" });

        const { _id, name, role } = user
        req.session.user = { _id, name, role }
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Session error');
            }
            res.redirect('/');
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { registerPage, signInPage, adminRegisterPage, adminSignup, login, signUp }