const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const auth = () => {
        return(req, res, next) => {
        const token = req.header('x-auth-token');

        if(!token) {
            return res.status(401)
            .json({ message: "You don't have a token, authorization denied." })
        }
        try {
            const decoded = jwt.verify(token, jwtSecret);
            
            req.user = decoded.user;
            if(req.user.role == 'employee') {
                if(req.method !== 'GET') {
                    return res.status(403).json({
                        message : "Access Denied."
                    })
                }
                return next();
            }
            if(req.user.role == 'supervisor') {
                if(req.method !== 'GET' || 'PUT') {
                    return res.status(403).json({
                        message: "Access Denied."
                    })
                }
            }
            if(req.user.role == 'hr') {
                return next();
            }
            res.status(403).json({
                message : "Access Denied"
            })
        } catch (err) {
            res.status(401)
            .json({ message: "Authorization denied."})
        }
    }
}

module.exports = auth;