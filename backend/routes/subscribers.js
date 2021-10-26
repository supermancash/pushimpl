const express = require('express');
const router = express.Router();
const SubscriberSchema = require('../models/Subscribers');


router.post('/', async (req, res) => {
  const subscriber = new SubscriberSchema(req.body)
  await subscriber.save().then(() => res.sendStatus(200));
});

module.exports = router;
