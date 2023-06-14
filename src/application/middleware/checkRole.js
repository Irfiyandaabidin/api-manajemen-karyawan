module.exports = (roles) => {
    return function (req, res, next) {
        if(roles.includes(req.user.role)){
            return next()
        }
        res.status(401).json({ message: `Access Denied. Only ${roles} is allowed to access` })
    }
}