import express from 'express';
import ViteExpress from 'vite-express';
import userRoutes from './routes/user.js';
import cors from 'cors';
import habitsRoutes from './routes/habits.js';
import iconsRoutes from './routes/icons.js';
import taskRoutes from './routes/tasks.js';
import planRoutes from './routes/plans.js'
import otherHabitRoutes from './routes/otherHabit.js'
import cookieParser from 'cookie-parser';
import path from 'path';



const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8080'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Serve uploaded images
app.use('/image', express.static(path.join(process.cwd(), 'public', 'image')));

app.use(express.json());
app.use(cookieParser());
app.use('/api/user/', userRoutes);
app.use('/api/habits/', habitsRoutes);
app.use('/api/tasks/', taskRoutes);
app.use('/api/plans/', planRoutes);
app.use('/api/icons/', iconsRoutes);
app.use('/api/',otherHabitRoutes);

ViteExpress.listen(app, port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
