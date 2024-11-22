import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', postRoutes);

// Routes will go here
const PORT = process.env.PORT || 4000;
app.listen(4000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;