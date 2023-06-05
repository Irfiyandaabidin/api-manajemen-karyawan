const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require("express-validator");
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400)
        .json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ error: ({ message: "This email is already registered." })});
        }

        user = new User ({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        )
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error." })
    }
}

module.exports = {
    register
}