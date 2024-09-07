import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { getHabits, createHabit, updateHabit, deleteHabit,getHabitsByDay } from '../controllers/habitController.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());

router.post('/create',authenticateToken,createHabit);
router.get('/',authenticateToken, getHabits);
router.get('/:day', authenticateToken, getHabitsByDay);
router.put('/update/:id', authenticateToken, updateHabit);
router.delete('/delete/:id', authenticateToken, deleteHabit);

export default router;
