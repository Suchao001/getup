import express from 'express';
import ViteExpress from 'vite-express';
import userRoutes from './routes/user.js';
import cors from 'cors';
import habitsRoutes from './routes/habits.js';
import iconsRoutes from './routes/icons.js';
import taskRoutes from './routes/tasks.js';
import planRoutes from './routes/plans.js'
import authenticateToken from './middleware/authenticateToken.js';
import { getRecommendCategory, getRecommendHabit} from './controllers/habitRecommendController.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;
const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  Credential:true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/api/user/', userRoutes);
app.use('/api/habits/', habitsRoutes);
app.use('/api/tasks/', taskRoutes);
app.use('/api/plans/', planRoutes);
app.use('/api/icons/', iconsRoutes);

app.get('/api/HabitRecommendCategory',authenticateToken, getRecommendCategory);
app.get('/api/HabitRecommendHabit/:id',authenticateToken, getRecommendHabit);

ViteExpress.listen(app, port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
