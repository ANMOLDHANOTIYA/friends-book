// how should errors are send to the client, this is the last middleware in the chain of middlewares,
//  so it will catch any error that was thrown in the previous middlewares or route handlers

const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

export default errorHandler;