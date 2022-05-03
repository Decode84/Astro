const User = require('../Models/User')

class UserController {
    /**
     * @description Render the user view
     * @param {*} res
     */
    async index (res) {
        res.render('users/index')
    }

    /**
     * @description Find the user in the database by their id
     * @param {*} UserID
     */
    async getUser (UserID) {
        const userData = await User.findById(UserID).catch(() => undefined)
        return userData
    }

    /**
     * @description Find the user in the database by their username
     * @param {string} userName
     */
    async getUserID (userName) {
        const userData = await User.findOne({ username: userName }).exec()
        return userData._id
    }
}

module.exports = new UserController()
