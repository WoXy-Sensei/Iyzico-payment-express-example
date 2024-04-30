import mongoose from 'mongoose'
import { nanoid } from '../utils/nanoid.js'

const paymentFailedSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            default: nanoid(),
            required: true,
            unique: true,
        },
        status: {
            type: String,
            default: 'failure',
            required: true,
            enum: ['failure'],
        },
        conversionId: {
            type: String,
            required: true,
            default: nanoid(),
        },
        errorCode: {
            type: String,
            required: true,
        },
        errorMessage: {
            type: String,
            required: true,
        },
        log: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v
            },
        },
        collection: 'paymentFailed',
        _id: true,
    }
)

const PaymentFailed = mongoose.model('PaymentFailed', paymentFailedSchema)

export default PaymentFailed
