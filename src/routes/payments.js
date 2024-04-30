import jwt from 'jsonwebtoken'
import Users from '../db/user.js'
import Carts from '../db/cart.js'
import ApiError from '../errors/ApiError.js'
import express from 'express'
import Session from '../middlewares/Session.js'
import Payments from '../services/iyzico/methods/Payments.js'
import { nanoid } from '../utils/nanoid.js'
import { complatePayment } from '../utils/payments.js'
import moment from 'moment'

const router = express.Router()

router.post('/:cartId', Session, async (req, res, next) => {
    const { card } = req.body

    if (!card) {
        throw new ApiError(400, 'CardRequired', 'Card is required')
    }

    if (!req.params.cartId) {
        throw new ApiError(400, 'CartIdRequired', 'CartId is required')
    }

    const cart = await Carts.findOne({ _id: req.params.cartId })
        .populate('buyer')
        .populate('products')

    if (!cart) {
        throw new ApiError(404, 'CartNotFound', 'Cart not found')
    }

    if (cart?.complated === true) {
        throw new ApiError(400, 'CartComplated', 'Cart already complated')
    }

    cart.registerCard = '0'

    const paidPrice = cart.products
        .map((product) => product.price)
        .reduce((a, b) => a + b, 0)
    const data = {
        locale: req.user.locale,
        conversationId: nanoid(),
        price: paidPrice,
        paidPrice: paidPrice,
        currency: cart.currency,
        installment: 1,
        basketId: String(cart._id),
        paymentChannel: 'WEB',
        paymentGroup: 'PRODUCT',
        paymentCard: card,

        buyer: {
            id: String(cart.buyer._id),
            name: cart.buyer.name,
            surname: cart.buyer.surname,
            email: cart.buyer.email,
            identityNumber: cart.buyer.identityNumber,
            registrationAddress: cart.buyer.address,
            lastLoginDate: moment(cart.buyer?.updatedAt).format(
                'YYYY-MM-DD HH:mm:ss'
            ),
            registrationDate: moment(cart.buyer?.createdAt).format(
                'YYYY-MM-DD HH:mm:ss'
            ),
            city: cart.buyer.city,
            country: cart.buyer.country,
            ip: req.user.ip,
            zipCode: cart.buyer.zipCode,
        },
        billingAddress: {
            contactName: cart.buyer.name,
            city: cart.buyer.city,
            country: cart.buyer.country,
            address: cart.buyer.address,
            zipCode: cart.buyer.zipCode,
        },
        shippingAddress: {
            contactName: cart.buyer.name,
            city: cart.buyer.city,
            country: cart.buyer.country,
            address: cart.buyer.address,
            zipCode: cart.buyer.zipCode,
        },
        basketItems: cart.products.map((product) => {
            return {
                id: String(product._id),
                name: product.name,
                category1: product.categories[0],
                category2: product.categories[1],
                itemType: product.itemType,
                price: product.price,
            }
        }),
    }

    let result = await Payments.createPayment(data)
    await complatePayment(result)
    res.json(result)
})

export default router
