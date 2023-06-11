module.exports = (roles) => {
    return function (req, res, next) {
        if(roles.includes(req.user.role)){
            return next()
        }
        console.log(roles, req.user.role)
        res.status(403).json({ message: `Access Denied. Only ${roles} is allowed to access` })
    }
}