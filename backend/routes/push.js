import express from 'express';
import jwt from "jsonwebtoken";
import push from 'web-push';

import config from '../config/auth.config.js';
import keys from '../config/push.config.js';
import con from "../dao/mysqldao.js";
import sendNotificationToAll from "../services/sendToAll.js";

const router = express.Router();

/*
    FILE DESCRIPTION: <host>/api/push route for handling requests regarding push notifications
 */

push.setVapidDetails('mailto:test@test.com', keys.publicKey, keys.privateKey);

/**
 * Post endpoint for pushing to all subscribers, is triggered in the frontend
 */

router.post('/', async (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({message: "No token provided!"});
    }

    /**
     * Checking whether token provided is a legitimate token or not
     */

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized!"});
        }
        req.userId = decoded.id;
    });

    /**
     * Get all subscibers from db, and insert the performed push into the push logs (db pushes table)
     * Lastly call sendNotificationToAll() with the result of the subscribers select
     */

    con.query(
        "select * from subscribers;" +
        "insert into pushes (msgTitle, msgBody, msgOnClick) values ('" +
        req.body.title + "', '" +
        req.body.body + "', '" +
        req.body.link +
        "');"
        ,
        async (err, result) => {
            if (err) throw err;
            sendNotificationToAll(result[0], req.body.title, req.body.body, req.body.link);
        });
    res.sendStatus(200);
});

/**
 * Get endpoint for seeing all pushes in sql db
 */

router.get('/logs', (req, res) => {
    con.query(
        "select * from pushes;"
        ,
        (err, result) => {
            if (err) res.sendStatus(500);
            res.send(JSON.stringify(result));
        });
});

export default router;
