import express from 'express';

import SubscriberSchema from '../models/Subscribers.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const subscriber = new SubscriberSchema(req.body)
  await subscriber.save().then(() => res.sendStatus(200));
});

export default router;
