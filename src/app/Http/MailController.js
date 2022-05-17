const nodemailer = require('nodemailer')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

class MailController {
    sendResetEmail (email, token, path) {
        const mail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_KEY
            }
        })

        const mailOptions = {
            from: 'ProjectHub.AAU@gmail.com',
            to: email,
            subject: 'Reset Password Link - ProjectHub.com',
            html: '<p>You requested for reset password, kindly use this <a href="http://' + path + '/reset?token=' + token + '">link</a> to reset your password</p>'

        }

        mail.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error)
        })
    }

    sendInviteEmail (email, name, path) {
        const mail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_KEY
            }
        })

        const mailOptions = {
            from: 'ProjectHub.AAU@gmail.com',
            to: email,
            subject: 'Project invitation link - ProjectHub.com',
            html: '<p>You have been invited and granted access to <a href="http://' + path + '">' + name + '</a></p>'

        }

        mail.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error)
        })
    }
}

module.exports = new MailController()
