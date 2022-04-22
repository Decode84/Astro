const { celebrate, Joi, Segments } = require('celebrate')

const authenticateValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        username: Joi.string().trim().min(2).max(32).required(),
        password: Joi.string().min(8).max(32).required()
    })
})

const registerValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().min(2).max(128).required(),
        username: Joi.string().trim().min(2).max(32).required(),
        email: Joi.string().email().min(5).max(128).lowercase().required(),
        password: Joi.string().min(8).max(32).required(),
        passwordConfirmation: Joi.string().min(8).max(32).required().valid(Joi.ref('password'))
    })
})

module.exports = { authenticateValidation, registerValidation }
