import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import imageRoutes from './routes/imageRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/i', imageRoutes);

// Routes will go here
const PORT = process.env.PORT || 4000;
app.listen(4000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;