import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', indexRouter);

app.use(express.static(path.resolve('../client/build')));

app.get('/sw.js', (req, res) => {
    res.sendFile(path.resolve('../client/build/sw.js'));
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve('../client/build/index.html'));
});

export default app;
