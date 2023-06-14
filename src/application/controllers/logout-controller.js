const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET

module.exports = (req, res) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const expiration = new Date(0);
        decoded.exp = expiration.getTime() / 1000;
        const updatedToken = jwt.sign(decoded, jwtSecret);

        res.json({ message: 'Logout successfull.'})
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}