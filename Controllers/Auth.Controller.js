const createError = require('http-errors')
const { authSchema } = require('../helpers/validation_schema')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')
const passHelper = require('../helpers/passHelper')

//load models
const User = require('../Models/User.model')




module.exports = {

    login: async (req, res, next) => {
        try {
                const result = await authSchema.validateAsync(req.body)
                const user = await User.findOne({
                    attributes:['user_id', 'user_password'],
                    where: {
                        user_name: result.username,
                        user_type: result.type,
                        user_status: 1
                    },
                    raw:true
                })

                
                if (!user) throw createError.NotFound('User not registered')
                const finalNodeGeneratedHash = user.user_password.replace('$2y$', '$2b$');

                const isMatch = await passHelper.isValidPassword(result.password, finalNodeGeneratedHash)
                if (!isMatch)
                    throw createError.Unauthorized('Invalid Username/Password')


                const accessToken = await signAccessToken(user.user_id)
                const refToken = await signRefreshToken(user.user_id)

                res.send({ accessToken: accessToken, refreshToken: refToken })

        } catch (error) {
          if (error.isJoi === true)
            return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },


    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            console.log(refreshToken)
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)

            const accessToken = await signAccessToken(userId)
            const refToken = await signRefreshToken(userId)
            res.send({ accessToken: accessToken, refreshToken: refToken })
        } catch (error) {
          next(error)
        }
    },


    register: async (req, res, next) => {
        try {

            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
                const userId = await verifyRefreshToken(refreshToken)
            if (!userId) throw createError.Unauthorized('Refresh Token not valid')


            const result = await authSchema.validateAsync(req.body)  
            const doesExist = await User.findOne({
              where: { 
                user_name: result.username
              } 
            });

            if (doesExist){
                throw createError.Conflict(`${result.username} is already been registered.`)
            }

            const hashPassword = await passHelper.hashPassword(result.password)

            const savedUser = await User.create({
                user_name: req.body.username,
                user_password: hashPassword,
                user_type: req.body.type
            })
            
            res.send({
              status: 200,
              message: 'Registration successfull',
              data: savedUser
            });

        } catch (error) {
              if (error.isJoi === true) error.status = 422
              next(error)
        }
    },









  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message)
          throw createError.InternalServerError()
        }
        console.log(val)
        res.sendStatus(204)
      })
    } catch (error) {
      next(error)
    }
  },


}

