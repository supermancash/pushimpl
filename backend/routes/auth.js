import express from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import config from "../config/auth.config.js";
import con from '../dao/mysqldao.js';

const router = express.Router();

/*
    FILE DESCRIPTION: <host>/api/auth route for handling requests regarding authentication
 */

/**
 * Post endpoint for creating a new user (only with master server pw <auth.config.js>),
 * frontend connection not yet implemented
 */

router.post('/signup', async (req, res) => {
    if (req.body.secret === config.secret) {
        con.query(
            "insert into admins values('" + req.body.user + "', '" + bcrypt.hashSync(req.body.password, 8) + "');"
            ,
            (err, result) => {
                if (err) res.sendStatus(500);
                console.log("Result: " + JSON.stringify(result));
            });
        res.sendStatus(200);
    }
    if (req.body.secret !== config.secret) res.sendStatus(401);

});

/**
 * Post endpoint for logging in from the frontend and receiving an access-token
 */

router.post('/signin', async (req, res) => {
    /**
     * Checking whether the given details were correct
     */
    con.query(
        "select * from admins where username='" + req.body.user + "';"
        ,
        (err, result) => {
            if (err) res.sendStatus(500);
            if (result.length === 0) res.status(404).send({message: "User Not found."});

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                result[0].encryptedpw
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password"
                });
            }

            const token = jwt.sign({id: result[0].username}, config.secret, {
                expiresIn: 86400 // 24h
            });

            res.status(200).send({
                username: result[0].username,
                accessToken: token
            });
        });
});

export default router;
