class AdminController {
    /**
     * Show the admin dashboard
     * @param {*} req
     * @param {*} res
     */
    async showBoard (req, res) {
        res.render('admin/board')
    };
}

module.exports = new AdminController()
