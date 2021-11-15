import express from 'express';

import con from '../dao/mysqldao.js';

const router = express.Router();

router.post('/', async (req, res) => {
    // req.body.endpoint (string) req.body.expirationTime req.body.keys.p256dh req.body.keys.auth
    console.log(req.body);

    con.query(
        "insert into subscribers select '" +
        req.body.endpoint + "', " + req.body.expirationTime + ", '" + req.body.keys.p256dh + "', '" + req.body.keys.auth + "' from dual" +
        " where not exists( select endpoint from subscribers where endpoint='" + req.body.endpoint + "');"
        ,
        (err, result) => {
            if (err) throw err;
            console.log("Result: " + JSON.stringify(result));
        }
    );

});

export default router;
