var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var userRouter = require('./routes/userRoutes');
var seasonRouter = require('./routes/seasonRoutes');
var harborRouter = require('./routes/harborRoutes');
var buoyRouter = require('./routes/buoyRoutes');
var eventRouter = require('./routes/eventRoutes');
var participationRouter = require('./routes/participationRoutes');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/users', userRouter);
app.use('/api/seasons', seasonRouter);
app.use('/api/harbors', harborRouter);
app.use('/api/buoys', buoyRouter);
app.use('/api/events', eventRouter);
app.use('/api/participations', participationRouter);


module.exports = app;
