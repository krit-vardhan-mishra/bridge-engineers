import User from '../models/User.js';
import crypto from 'crypto';
import { sendTokenResponse, handleError } from '../utils/helpers.js';

export async function registerUser(req, res, _) {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({ name, email, password, role });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        handleError(res, error, "Error in registering user.");
    }
}

export async function loginUser(req, res, _) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handleError(res, new Error('Please enter an email and password'), 'Please enter an email and password', 400);
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return handleError(res, new Error('Invalid credentials'), 'Invalid credentials', 401);
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return handleError(res, new Error('Invalid credentials'), 'Invalid credentials', 401);
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        handleError(res, error, "Error in login user.");
    }
}

export async function getUserProfile(req, res, _) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return handleError(res, new Error("User not found."), "User not found.", 404);
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        handleError(res, error, "Error getting user profile.");
    }
}

export async function forgotPassword(req, res, _) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ success: true, message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

        try {
            console.log(`Password reset email simulated for ${user.email}. Token: ${resetToken}`);

            res.status(200).json({ success: true, message: 'Password reset email sent (simulated).' });
        } catch (err) {
            console.error("Error sending email:", err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return handleError(res, err, 'Email could not be sent', 500);
        }

    } catch (error) {
        handleError(res, error, "Error forgetting password.");
    }
}

export async function resetPassword(req, res, _) {
    try {
        const resettoken = req.params.resettoken;
        const { password } = req.body;

        const hashedToken = crypto.createHash('sha256').update(resettoken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return handleError(res, new Error('Invalid or expired reset token'), 'Invalid or expired reset token', 400);
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        sendTokenResponse(user, 200, res);
    } catch (error) {
        handleError(res, error, "Error resetting password.");
    }
}