exports.checkAdmin = (req, res, next) => {
    
    if (req.role != 'admin') {
        console.log(req, 'sini')
        res.send(403, 'Forbidden')
    }
    next()
}
