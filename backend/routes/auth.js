const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const router = express.Router();
const AdminSchema = require('../models/Admins');

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

            console.log(req.body)
            console.log(user.password)

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
    const admin = new AdminSchema({
        user: req.body.user,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    await admin.save().then(() => res.sendStatus(200));
});

module.exports = router;
