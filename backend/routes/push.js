import express from 'express';
import jwt from "jsonwebtoken";
import push from 'web-push';

import config from '../config/auth.config.js';
import keys from '../config/push.config.js';
import con from "../dao/mysqldao.js";

const router = express.Router();

push.setVapidDetails('mailto:test@test.com', keys.publicKey, keys.privateKey);

router.post('/', async (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({message: "No token provided!"});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized!"});
        }
        req.userId = decoded.id;
    });

    con.query(
        "select * from subscribers"
        ,
        async (err, result) => {
            if (err) throw err;
            sendNotificationToAll(result, req.body.title, req.body.body, req.body.link);
        });
    res.sendStatus(200)
});

const sendNotificationToAll = (subscribersSQLformat, title, body, link) => {
    if (!link.includes("https://") && !link.includes("http://")) link = "https://" + link;
    let options = {
        title: title,
        body: body,
        url: link
    }
    let subscribers = [];
    for (let i = 0; i < subscribersSQLformat.length; i++) {
        const subscriber = {
            endpoint: subscribersSQLformat[i].endpoint,
            expirationTime: null,
            keys: {
                p256dh: subscribersSQLformat[i].p256dhkey,
                auth: subscribersSQLformat[i].authkey
            }
        }
        subscribers.push(subscriber)
    }

    for (let i = 0; i < subscribers.length; i++) {
        push.sendNotification(subscribers[i], JSON.stringify(options));
    }
}

export default router;
