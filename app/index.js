import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import redis from 'redis';
import responseTime from 'response-time';

import index from '../routes';
import users from '../routes/users';
import { CategoryRoutes, SubCategoryRoutes, GroupRoutes, MeetUpRoutes, UserRoutes } from './modules';

import response from '../utils/response';

import { connectToDatabase } from "../utils/dbConnection";

const app = express();

connectToDatabase();

const client = redis.createClient();
client.on('connect', function() {
    console.log('connected');
});

app.disable('x-powered-by');
app.use(responseTime());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(function(req, res, next){
    response(res);
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/api/v1', [ CategoryRoutes, SubCategoryRoutes, GroupRoutes, MeetUpRoutes, UserRoutes ]);

const PORT = process.env.PORT || 3001;

app.listen(PORT,  (err) => {
    if(err){
        log.error(err)
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});


module.exports = app;
