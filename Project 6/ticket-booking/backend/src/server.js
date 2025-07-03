import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import { protect } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

dotenv.config(); 

connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tickets', protect, ticketRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});