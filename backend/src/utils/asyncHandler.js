//handles async errors in express routes, so we don't have to write try/catch blocks in every route handler
const asyncHandler = (requestHandler) => {

    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch(next);
    };

};

export default asyncHandler;