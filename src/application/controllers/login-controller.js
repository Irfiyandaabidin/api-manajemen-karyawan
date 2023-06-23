const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

module.exports = async (req, res) => {
    await check('email', 'Email is required').notEmpty().run(req);
    await check('email', 'Please include a valid email').isEmail().run(req);
    await check('password', 'Password is required').notEmpty().run(req);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ error: ({ message: "User invalid" })})
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ error: ({ message: "User invalid" })})
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        )
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}