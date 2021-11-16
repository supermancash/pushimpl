import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';

const app = express();

/*
    FILE DESCRIPTION: app definition file
 */

/**
 * Connecting middleware
 */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Redirecting traffic to https in production (otherwise sw.js can't be connected)
 */

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
}

/**
 * Defining api routes using the indexRouter
 */

app.use('/api', indexRouter);

/**
 * Connecting react frontend
 */

app.use(express.static(path.resolve('../client/build')));

/**
 * Defining catchall for the browser, preventing a white page bug
 */

app.get('*', (req, res) => {
    res.sendFile(path.resolve('../client/build/index.html'));
});


export default app;
