import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const randomColorHEX = () => {
    return Math.floor(Math.random() * 16777215).toString(16)
}

const userSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            default: uuidv4(),
            required: true,
            unique: true,
        },
        locale: {
            type: String,
            default: 'en',
            required: true,
            enum: ['en', 'tr'],
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        surname: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: 5,
            maxlength: 255,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 1024,
        },
        color: {
            type: String,
            default: randomColorHEX(),
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        avatarUrl: {
            type: String,
            default: `https://ui-avatars.com/api/?name=John+Doe&background=${randomColorHEX()}&color=fff`,
        },
        ip: {
            type: String,
            default: '11.11.11.111',
        },
        country: {
            type: String,
            default: 'TR',
        },
        city: {
            type: String,
            default: 'Istanbul',
        },
        zipCode: {
            type: String,
            default: '34000',
        },
        identityNumber: {
            type: String,
            default: '11111111111',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        address: {
            type: String,
        }
    },
    {
        _id: true,
        collection: 'users',
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password
                delete ret.__v
                return {
                    ...ret,
                }
            },
        },
    }
)

userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10)
        return next()
    } catch (error) {
        return next(error)
    }
})

const Users = mongoose.model('Users', userSchema)

Users.starterData = [
    {
        _id: new mongoose.Types.ObjectId('61d054de0d8af19519e88a61'),
        locale: 'tr',
        name: 'John',
        surname: 'Doe',
        email: 'email@email.com',
        phoneNumber: '+905350000000',
        identityNumber: '74300864791',
        password: '123qweqwe456',
        avatarUrl: 'https://i.pravatar.cc/300',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732',
        ip: '85.34.78.112',
    },
]

Users.exampleUserCardData = {
    cardAlias: 'Benim Kartım',
    cardHolderName: 'John Doe',
    cardNumber: '5528790000000008',
    expireMonth: '12',
    expireYear: '2030',
    cvc: '123',
}

Users.initializer = async () => {
    const count = await Users.estimatedDocumentCount()
    console.log('Users count:', count);
    if (count === 0) {
        await Users.create(Users.starterData)
    }
}

Users.initializer()

export default Users
