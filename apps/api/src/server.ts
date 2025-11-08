import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillbuilder';

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully.'))
  .catch((error) => console.error('MongoDB connection error:', error));


// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Routes ---
// Health check route
import authRoutes from './routes/auth'; // <--- ADD THIS IMPORT

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is healthy' });
});


// We will add more routes here later (e.g., app.use('/api/auth', authRoutes))


// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});