import ApiError from '../errors/ApiError.js'

const GenericErrorHandler = (err, req, res, next) => {
    if (!(err instanceof ApiError)) {
        console.error(err)
    }

    res.status(err.status || 500).json({
        status: err.status || 500,
        error: err.message || 'Internal Server Error',
        code: err.code || 'INTERNAL_SERVER_ERROR',
    })
}

export default GenericErrorHandler
