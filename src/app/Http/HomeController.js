class HomeController {
    /**
     * Show the home page
     * @param {*} req
     * @param {*} res
     */
    async showHome (req, res) {
        res.render('home/home')
    }
}

module.exports = new HomeController()
