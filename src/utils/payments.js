import mongoose from 'mongoose'
import PaymentSuccess from '../db/paymentSuccess.js'
import PaymentFailed from '../db/paymentFailed.js'
import Carts from '../db/cart.js'

export const complatePayment = async (result) => {
    if (result.status === 'success') {
        await Carts.updateOne(
            { _id:new mongoose.Types.ObjectId(result.basketId) },
            { completed: true }
        )

        await PaymentSuccess.create({
            status: result.status,
            cartId: result.basketId,
            conversationId: result.conversationId,
            paymentId: result.paymentId,
            price: result.price,
            paidPrice: result.paidPrice,
            itemTransactions: result.itemTransactions.map((item) => {
                return {
                    itemId: item.itemId,
                    paymentTransactionId: item.paymentTransactionId,
                    price: item.price,
                    paidPrice: item.paidPrice,
                    productId : item.itemId
                }
            }),
            log: result,
        })
    } else {
        console.log(result);
        await PaymentFailed.create({
            status: result.status,
            conversionId: result.conversionId,
            errorCode: result.errorCode,
            errorMessage: result.errorMessage,
            log: result,
        })
    }
}

