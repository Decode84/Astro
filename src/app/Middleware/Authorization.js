class Authorization {
    /**
    * Login required middleware
    */
    async authLogin (req, res, next) {
        if (!req.session || !req.session.user) {
            return res.redirect('/login')
        }
        await next()
    }

    /**
    * Role required middleware
    */
    async authRole (req, res, next) {
        if (req.user.role !== role) {
            return res.send('Not allowed')
        }
        await next()
    }
}

module.exports = new Authorization()
