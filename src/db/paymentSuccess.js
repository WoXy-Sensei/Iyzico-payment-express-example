import mongoose, { Schema } from 'mongoose'
import { nanoid } from '../utils/nanoid.js'

const ItemTransactionSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: nanoid(),
        required: true,
        unique: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    paymentTransactionId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    paidPrice: {
        type: Number,
        required: true,
        min: 0,
    },
})

const paymentSuccessSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            default: nanoid(),
            required: true,
            unique: true,
        },
        status: {
            type: String,
            default: 'success',
            required: true,
            enum: ['success'],
        },
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Carts',
            required: true,
        },
        conversationId: {
            type: String,
            required: true,
            default: nanoid(),
        },
        curreny: {
            type: String,
            required: true,
            default: 'USD',
            enum: ['USD', 'EUR', 'TRY'],
        },
        paymentId: {
            type: String,
            required: true,
        },
        paidPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        itemTransactions: {
            type: [ItemTransactionSchema],
            required: true,
        },
        log: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    {
        _id: true,
        timestamps: true,
        collection: 'paymentSuccess',
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v
            },
        },
    }
)

const PaymentSuccess = mongoose.model('paymentSuccess', paymentSuccessSchema)

export default PaymentSuccess
