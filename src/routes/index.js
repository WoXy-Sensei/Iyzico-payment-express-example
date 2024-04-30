import express from 'express'
import auth from './auth.js'
import payments from './payments.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
    res.send('test')
})

router.use('/auth', auth)
router.use('/payments', payments)

export default router
