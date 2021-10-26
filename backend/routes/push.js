const express = require('express');
const jwt = require("jsonwebtoken");
const push = require('web-push');
const router = express.Router();
const config = require('../config/auth.config');
const SubscriberSchema = require('../models/Subscribers');
const keys = require('../config/push.config');

push.setVapidDetails('mailto:test@test.com', keys.publicKey, keys.privateKey);

router.post('/', async (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
    });
    sendNotificationToAll(await SubscriberSchema.find(), req.body.title, req.body.body, req.body.link);
});

const sendNotificationToAll = (subscribers, title, body, link) => {
    if (!link.includes("https://") || !link.includes("http://")) link = "https://" + link;
    let options = {
        title: title,
        body: body,
        url: link
    }
    for(let i = 0; i<subscribers.length; i++){
        push.sendNotification(subscribers[i], JSON.stringify(options));
    }
}

module.exports = router;
