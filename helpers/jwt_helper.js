const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./init_redis')

module.exports = {
	signAccessToken: (userId) => {
		return new Promise((resolve, reject) => {
			const payload = {}
			const secret = process.env.ACCESS_TOKEN_SECRET
			const options = {
				expiresIn: '1h',
				issuer: 'Rohit',
				audience: `${userId}`,
			}
			JWT.sign(payload, secret, options, (err, token) => {
				if (err) {
					reject(createError.InternalServerError())
					return
				}
				resolve(token)
			})
		})
	},

	signRefreshToken: (userId) => {
		return new Promise((resolve, reject) => {
			const payload = {}
			const secret = process.env.REFRESH_TOKEN_SECRET
			const options = {
				expiresIn: '1y',
				issuer: 'Rohit',
				audience: `${userId}`,
			}
			JWT.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message)
					// reject(err)
					reject(createError.InternalServerError())
				}

				client.SET(`auth-${userId}`, token, (err, reply) => {
                    if (err) {
                        reject(createError.InternalServerError())
                        return
                    }
                    client.expire(`auth-${userId}`, process.env.REFRESH_TOKEN_EXPIRY, (err, reply) => {
                        if (err) {
                            reject(createError.InternalServerError())
                            return
                        }
                    })
                    resolve(token)
                })
			})
		})
	},

	verifyRefreshToken: (refreshToken) => {
		return new Promise((resolve, reject) => {
			JWT.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				(err, payload) => {
					if (err) return reject(createError.Unauthorized())
					const userId = payload.aud
					client.GET(`auth-${userId}`, (err, result) => {
						if (err) {
							reject(createError.InternalServerError())
							return
						}
						if (refreshToken === result) return resolve(userId)
						reject(createError.Unauthorized())
					})
				}
			)
		})
	},

	verifyAccessToken: (req, res, next) => {
		if (!req.cookies.secretCookie) return next(createError.Unauthorized())
		const token = req.cookies.secretCookie
		JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
			if (err) {
				const message =
					err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
				return next(createError.Unauthorized(message))
			}
			req.payload = payload
			next()
		})
	},

}
