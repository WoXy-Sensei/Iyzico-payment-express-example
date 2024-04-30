import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Users from '../db/user.js'
import ApiError from '../errors/ApiError.js'
import express from 'express'

const router = express.Router()

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ email: email })

        if (!user) {
            throw new ApiError(401, 'Unauthorized', 'Unauthorized')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new ApiError(401, 'Unauthorized', 'Unauthorized')
        }

        const userJson = user.toJSON()
        const token = jwt.sign({ userJson }, process.env.JWT_SECRET)
        res.json({ token })
    } catch (error) {
        throw new ApiError(500, 'ERROR', 'ERROR')
    }
})

export default router
