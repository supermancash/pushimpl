import express from 'express';

import con from '../dao/mysqldao.js';

const router = express.Router();

router.post('/', async (req, res) => {
  // req.body.endpoint (string) req.body.expirationTime req.body.keys.p256dh req.body.keys.auth
  console.log(req.body);

  con.connect((err) => {
    if (err) console.log(err);
    con.query(
        "create table if not exists subscribers(endpoint varchar(200) primary key, expirationTime char(10), p256dhkey varchar(90), authkey varchar(25)); " +
        "show tables;" +
        "insert into subscribers values ('" + req.body.endpoint + "', " + req.body.expirationTime + ", '" + req.body.keys.p256dh + "', '" + req.body.keys.auth + "');" +
        "select * from subscribers;"
        ,
        (err, result) => {
          if (err) throw err;
          console.log("Result: " + JSON.stringify(result));
        });
  });

});

export default router;
