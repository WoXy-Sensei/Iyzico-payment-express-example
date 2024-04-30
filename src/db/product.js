import mongoose from 'mongoose'
import { nanoid } from '../utils/nanoid.js'

const productSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            default: nanoid(),
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        imagesURL: {
            type: [String],
            required: false,
        },
        categories: {
            type: [String],
            required: true,
        },
        itemType: {
            type: String,
            required: true,
            enum: ['PHYSICAL', 'VIRTUAL', 'SERVICE'],
        },
        brand: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        curreny: {
            type: String,
            required: true,
            default: 'USD',
            enum: ['USD', 'EUR', 'TRY'],
        },
    },
    {
        _id: true,
        collection: 'products',
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.__v
                return {
                    ...ret,
                }
            },
        },
    }
)

const Products = mongoose.model('Products', productSchema)

Products.starterData = [
    {
        _id: new mongoose.Types.ObjectId('61d054e5a2f56187efb0a3b2'),
        name: 'Samsung Galaxy S20',
        uid: nanoid(),
        images: [
            'https://picsum.photos/500/500?random=1',
            'https://picsum.photos/500/500?random=1',
            'https://picsum.photos/500/500?random=1',
        ],
        categories: ['Telefonlar', 'Android Telefonlar'],
        brand: 'Samsung',
        price: 10000,
        currency: 'TRY',
        stock: 10,
        itemType: 'PHYSICAL',
    },
    {
        _id: new mongoose.Types.ObjectId('61d055016272c60f701be7ac'),
        name: 'Iphone 12',
        uid: nanoid(),
        images: [
            'https://picsum.photos/500/500?random=1',
            'https://picsum.photos/500/500?random=1',
            'https://picsum.photos/500/500?random=1',
        ],
        categories: ['Telefonlar', 'iOS Telefonlar'],
        brand: 'Apple',
        price: 13000,
        currency: 'TRY',
        stock: 5,
        itemType: 'PHYSICAL',
    },
    {
        _id: new mongoose.Types.ObjectId('61d055095087612ecee33a20'),
        name: 'Ipad Pro 2021',
        uid: nanoid(),
        images: [
            'https://picsum.photos/500/500?random=1',
            'https://picsum.photos/500/500?random=1',
            'https://picsum.photos/500/500?random=1',
        ],
        categories: ['Tabletler', 'iPad'],
        brand: 'Apple',
        price: 18000,
        currency: 'TRY',
        stock: 8,
        itemType: 'PHYSICAL',
    },
]

Products.initializer = async () => {
    const count = await Products.estimatedDocumentCount()
    if (count === 0) {
        await Products.create(Products.starterData)
    }
}

Products.initializer()

export default Products
