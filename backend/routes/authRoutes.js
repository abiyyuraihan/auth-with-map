import express from 'express';
import { register, verifyOTP, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/logout', logout);

export default router;