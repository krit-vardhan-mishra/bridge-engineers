const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    console.error(err.stack);
    
    if (err.name === 'CastError') {
        message = `Resource not found with id of ${err.value}`;
        statusCode = 404;
    }

    if (err.code === 11000) {
        message = 'Duplicate field value entered';
        statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        message = errors.join(', ');
        statusCode = 400;
    }

    if (err.name === 'JsonWebTokenError') {
        message = 'Not authorized, token failed (invalid token)';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Not authorized, token failed (token expired)';
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        error: message
    });
};

export default errorHandler;
