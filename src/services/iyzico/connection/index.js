import Iyzipay from 'iyzipay'

const config = {
    apiKey: 'api-key',
    secretKey: 'secret-key',
    uri: 'https://sandbox-api.iyzipay.com',
}

const iyzipay = new Iyzipay(config)

iyzipay.binNumber.retrieve({}, function (err, result) {
    console.log(err, result)
})

export default iyzipay
