// userRoutes.js
import express from 'express';
import { getUsersSortedByDistance } from '../controllers/userController.js';

const router = express.Router();

router.get('/sorted', getUsersSortedByDistance);

export default router;
