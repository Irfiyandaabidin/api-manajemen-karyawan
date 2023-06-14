module.exports = (req, res, next) => {
    try {
        if(req.user.role == "hr"){
            return next()
        }
        res.status(403).json({ message: "Access Denied. Only HR is allowed to access."})
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}