import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import {  getRecommendCategory,getRecommendHabit} from '../controllers/habitRecommendController.js';
import { getHabitHistory, getHabitCount} from '../controllers/habitHistoryController.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());


router.get('/HabitRecommendCategory', authenticateToken, getRecommendCategory);
router.get('/HabitRecommendHabit/:id', authenticateToken, getRecommendHabit);
router.get('/HabitHistory', authenticateToken, getHabitHistory);
router.get('/HabitCount', authenticateToken, getHabitCount);


export default router;