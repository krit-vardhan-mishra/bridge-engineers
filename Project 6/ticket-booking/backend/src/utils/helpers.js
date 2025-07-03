import mongoose from 'mongoose';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true 
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

export function handleError(res, error, message = "Server Error", statusCode = 500) {
    console.error(message, error);

    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    if (error.code === 11000) {
        return res.status(400).json({ success: false, error: 'Duplicate field value entered (e.g., email already exists)' });
    }
    return res.status(statusCode).json({ success: false, error: message });
}

export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export async function withMongoSession(callback) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await callback(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export function extractTicketFields(body) {
    const { title, description, eventDate, location, price, totalSeats } = body;
    return { title, description, eventDate, location, price, totalSeats };
}