import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import recipeRoutes from './rouotes/recipeRoutes.js';

config();
connectDB();

const app = express();
app.use(json());
app.use('/api', recipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));