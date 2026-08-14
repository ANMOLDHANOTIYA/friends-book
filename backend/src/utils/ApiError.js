// What error happened and what status does it have
class ApiError extends Error {

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // Javascript's built-in Error machinery, we are calling the constructor of the parent class Error
        super(message);

        // makes error.statusCode work, so we can use it in our errorHandler middleware
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        //info about where the error occurred, useful for debugging
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;