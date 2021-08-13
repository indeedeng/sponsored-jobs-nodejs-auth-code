const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const jobFeedRouter = require('./routes/jobFeed');
const indexRouter = require('./routes/index');
const oauthRouter = require('./routes/oauth');
const campaignRouter = require('./routes/campaign');
const config = require('./config');

const app = express();

// session setup
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'), (err) => {
  if (err) {
    console.error(err);
  }
});
hbs.registerHelper('formatCurrency', (currencyCode, amount) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });

  return new hbs.handlebars.SafeString(formatter.format(amount));
});
hbs.registerHelper('matches', (arg1, arg2, options) => ((arg1 === arg2) ? options.fn(this) : options.inverse(this)));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/oauth-callback', oauthRouter);
app.use('/campaign', campaignRouter);
app.use('/job-feed', jobFeedRouter);

// catch 404 and forward to error handler
app.use((req) => {
  console.error(`NOT FOUND: ${req.url}`);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
