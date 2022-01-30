const bcrypt = require('bcrypt');

module.exports = {
    hashPassword: async function(password) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                return hashedPassword
            }

        } catch (error) {
            return error
        }
    },
    isValidPassword: async function(password, cust_password) {
        try {
            return await bcrypt.compare(password, cust_password)
        } catch (error) {
            throw error
        }
    }

}