const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = proccess.env.JWT_SECRET;

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if(!token) {
        res.status(401)
        .json({ message: "You don't have a token, authorization denied." })
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded.user;
        
        next();
    } catch (err) {
        res.status(401)
        .json({ message: "Authorization denied."})
    }
}