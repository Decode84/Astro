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
}

module.exports = new Authorization()
