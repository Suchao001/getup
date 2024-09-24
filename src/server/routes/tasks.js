import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { getTasks, createTask, updateTask, deleteTask, checkTask,getDoneTasks } from '../controllers/taskController.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());

router.post('/create', authenticateToken, createTask);
router.get('/',authenticateToken, getTasks);
router.put('/:id',authenticateToken, checkTask);
router.put('/update/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);
router.get('/done', authenticateToken, getDoneTasks);
export default router;
