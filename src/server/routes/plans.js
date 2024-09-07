import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { getPlans, createPlan, updatePlan, deletePlan, getPlansByDate, getPlansById} from '../controllers/planController.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());

router.post('/create', authenticateToken, createPlan);
router.get('/',authenticateToken, getPlans);
router.get('/id/:id',authenticateToken, getPlansById);
router.get('/date/:date', authenticateToken, getPlansByDate);
router.put('/update/:id', authenticateToken, updatePlan);
router.delete('/delete/:id', authenticateToken, deletePlan);

export default router;
