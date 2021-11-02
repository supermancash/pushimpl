import express from 'express';
import jwt from "jsonwebtoken";
import push from 'web-push';

import config from '../config/auth.config.js';
import SubscriberSchema from '../models/Subscribers.js';
import keys from '../config/push.config.js';

const router = express.Router();

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
    res.sendStatus(200)
});

const sendNotificationToAll = (subscribers, title, body, link) => {
    if (!link.includes("https://") && !link.includes("http://")) link = "https://" + link;
    let options = {
        title: title,
        body: body,
        url: link
    }
    for(let i = 0; i<subscribers.length; i++){
        push.sendNotification(subscribers[i], JSON.stringify(options));
    }
}

export default router;
