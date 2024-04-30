class ApiError extends Error {
    constructor(status, message, code) {
        super(message)
        this.status = status
        this.name = this.constructor.name
        this.code = code
    }

    static badRequest(message, code) {
        return new ApiError(400, message, code)
    }

    static unauthorized(message, code) {
        return new ApiError(401, message, code)
    }

    static forbidden(message, code) {
        return new ApiError(403, message, code)
    }

    static notFound(message, code) {
        return new ApiError(404, message, code)
    }
}

export default ApiError
