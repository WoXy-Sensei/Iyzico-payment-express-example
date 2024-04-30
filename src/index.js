import 'express-async-errors'
import * as dotenv from 'dotenv'
import config from './config.js'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import GenericErrorHandler from './middlewares/GenericErrorHandler.js'
import mongoose from 'mongoose'
import passport, { Passport } from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import ApiError from './errors/ApiError.js'
import apiRoute from './routes/index.js'
import Users from './db/user.js'

const envPath = config.production ? './env/.production' : './env/.dev'
dotenv.config({ path: envPath })

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((err) => {
        console.error(err)
    })

const app = express()

app.use(cors({ origin: ['http://localhost:3000'] }))
app.use(
    logger({
        format: process.env.LOGGER,
    })
)
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '1mb' }))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    done(err, id)
})

app.use(passport.initialize())

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}

passport.use(
    new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const _id = jwt_payload.userJson._id
            const user = await Users.findById({ _id: _id })
            if (user) {
                return done(null, user.toJSON())
            } else {
                return done(
                    new ApiError(401, 'Unauthorized', 'Unauthorized'),
                    false
                )
            }
        } catch (error) {
            done(error, false)
        }
    })
)

app.use('/api', apiRoute)

app.use(GenericErrorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
