import express, { json } from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import contactsRoutes from './routes/contactsRoutes.js';

const app = express();
connectDB();

app.use(cors());
app.use(json());

app.use('/api/contacts', contactsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));