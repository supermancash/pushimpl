import express from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import config from "../config/auth.config.js";
import AdminSchema from '../models/Admins.js';

const router = express.Router();

router.post('/signin', async (req, res) => {
    AdminSchema.findOne({
        username: req.body.username
    }, 'password')
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );


            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24h
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                accessToken: token
            });
        });

});

router.post('/signup', async (req, res) => {
    if(req.body.secret===config.secret) {
        const admin = new AdminSchema({
            user: req.body.user,
            password: bcrypt.hashSync(req.body.password, 8)
        });
        await admin.save().then(() => res.sendStatus(200));
    }
    if(req.body.secret!==config.secret) res.sendStatus(401);

});

export default router;
