import express from 'express';

import subscribersRouter from './subscribers.js';
import pushRouter from './push.js';
import authRouter from './auth.js';

const router = express.Router();

router.use('/subscribers', subscribersRouter);
router.use('/push', pushRouter);
router.use('/auth', authRouter);

export default router;
