import mongoose from 'mongoose'
import bycript from 'bcryptjs'
import { nanoid } from '../utils/nanoid.js'

const cartSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            default: nanoid(),
            required: true,
            unique: true,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        products: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            ref: 'Products',
        },
        currency: {
            type: String,
            required: true,
            default: 'USD',
            enum: ['USD', 'EUR', 'TRY'],
        },
        completed: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        _id: true,
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v
            },
        },
        collection: 'carts',
    }
)

const Carts = mongoose.model('Carts', cartSchema)

Carts.starterData = {
    _id: new mongoose.Types.ObjectId('61d05524bf858c7449e9d456'),
    buyer: new mongoose.Types.ObjectId('61d054de0d8af19519e88a61'),
    completed: false,
    products: [
        new mongoose.Types.ObjectId('61d054e5a2f56187efb0a3b2'),
        new mongoose.Types.ObjectId('61d055016272c60f701be7ac'),
        new mongoose.Types.ObjectId('61d055095087612ecee33a20'),
    ],
    currency: 'TRY',
}

Carts.initializer = async () => {
    const count = await Carts.estimatedDocumentCount()
    if (count === 0) {
        await Carts.create(Carts.starterData)
    }
}

Carts.initializer()

export default Carts
