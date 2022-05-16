const nodemailer = require('nodemailer')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

class MailController {
    sendEmail(email, token) {
        const mail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_KEY
            }
        })
        console.log(mail)
        const mailOptions = {
            from: 'ProjectHub.AAU@gmail.com',
            to: email,
            subject: 'Reset Password Link - ProjectHub.com',
            html: '<p>You requested for reset password, kindly use this <a href="http://localhost:4000/reset?token=' + token + '">link</a> to reset your password</p>'

        }

        mail.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error)
        })
    }
}

module.exports = new MailController()
