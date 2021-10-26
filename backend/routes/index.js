const express = require('express');
const router = express.Router();

const subscribersRouter = require('./subscribers');
const pushRouter = require('./push');
const authRouter = require('./auth');

router.use('/subscribers', subscribersRouter);
router.use('/push', pushRouter);
router.use('/auth', authRouter);

module.exports = router;
