import express from 'express';

import con from '../dao/mysqldao.js';

const router = express.Router();

/*
    FILE DESCRIPTION: <host>/api/subscribers route for handling requests regarding new push subscriptions
 */

/**
 * Post endpoint for adding a new subscriber
 */

router.post('/', async (req, res) => {
    /**
     *  Inserting subscriber into the db, provided that the subscriber doesn't already exist
     */

    con.query(
        "insert into subscribers select '" +
        req.body.endpoint + "', " +
        req.body.expirationTime + ", '" +
        req.body.keys.p256dh + "', '" +
        req.body.keys.auth + "' from dual where not exists( select endpoint from subscribers where endpoint='" +
        req.body.endpoint + "');"
        ,
        (err, result) => {
            if (err) throw err;
            console.log("Result: " + JSON.stringify(result));
            res.sendStatus(200);
        }
    );
});

export default router;
