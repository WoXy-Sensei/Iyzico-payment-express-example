import iyzipay from '../connection/index.js'

const createPayment = async (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.payment.create(data, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

export default {
    createPayment,
}
