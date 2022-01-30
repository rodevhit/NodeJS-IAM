const Joi = require('@hapi/joi')

const regSchema = Joi.object({
  username: Joi.string().regex(/^([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/).required().messages({
      "string.base": `"username" should be a type of 'text'`,
      "string.empty": `"username" cannot be an empty field`,
      "string.min": `"username" should have a minimum length of {#limit}`,
      "string.max": `"username" should have a maximum length of {#limit}`,
      "any.required": `"username" is a required field`
    }),
  type: Joi.number().min(1).required(),
  password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})
const loginSchema = Joi.object({
  username: Joi.string().regex(/^([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/).required().messages({
      "string.base": `"username" should be a type of 'text'`,
      "string.empty": `"username" cannot be an empty field`,
      "string.min": `"username" should have a minimum length of {#limit}`,
      "string.max": `"username" should have a maximum length of {#limit}`,
      "any.required": `"username" is a required field`
    }),
  password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

module.exports = {
  regSchema,
  loginSchema
}
