import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { handleError } from '../utils/helpers.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return handleError(res, new Error('Not authorized to access this route'), 'Not authorized to access this route', 401);
    }

    try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return handleError(res, new Error('User associated with token not found'), 'Not authorized, user not found', 401);
        }

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        if (error.name === 'JsonWebTokenError') {
            return handleError(res, error, 'Not authorized, token failed (invalid token)', 401);
        }
        if (error.name === 'TokenExpiredError') {
            return handleError(res, error, 'Not authorized, token failed (token expired)', 401);
        }
        handleError(res, error, 'Not authorized to access this route', 401);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return handleError(res, new Error(`User role ${req.user.role} is not authorized to access this route`),
                `User role ${req.user.role} is not authorized to access this route`, 403); // 403 Forbidden
        }
        next();
    };
};