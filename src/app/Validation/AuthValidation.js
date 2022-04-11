const { celebrate, Joi, Segments } = require('celebrate')

const authenticateValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
})

const registerValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        passwordConfirmation: Joi.string().required().valid(Joi.ref('password'))
    })
})

module.exports = { authenticateValidation, registerValidation }
