import express from 'express';
import { register, login ,upload_img,getUserInfo,getUserProfile,updateUserProfile,getTotalPoint} from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import cookieParser from 'cookie-parser';
import upload from '../middleware/multerConfig.js'; 


const router = express.Router();
router.use(cookieParser());

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await register(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { token } = await login(username, password);
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    res.json({ success: true });
  } catch (error) {
    console.log('login error:', error.message);
    res.status(401).json({ message: error.message });
  }
});

router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ success: true });
});

router.get('/get-cookie', (req, res) => {
  const token = req.cookies.authToken;
  if (token) {
    res.json({ success: true, token });
  } else {
    res.json({ success: false, message: 'No token found' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('authToken', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

router.post('/upload_img', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filename = file.filename; 
    await upload_img(userId, filename);

    res.status(200).json({
      message: 'File uploaded successfully',
      filename: filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      ok: true,
    });
  } catch (err) {
    console.error('File upload error:', err.message);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

router.get('/user_info', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await getUserInfo(user_id);
    res.json({ok:true, user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user_profile', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await getUserProfile(user_id);
    res.json({ok:true, user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update_profile', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = req.body;
    await updateUserProfile(user_id, data);
    res.json({ok:true, message: 'User profile updated successfully'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/total_point', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const period = req.query.period;
    const totalPoint = await getTotalPoint(user_id, period);
    res.json({ok:true, totalPoint});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
