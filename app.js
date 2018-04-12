const express 	     = require('express')
const config		     = require('config')
const bodyParser     = require('body-parser')
const coookieParser  = require('cookie-parser')
var session          = require('express-session');
const passport       = require('passport');
const bcrypt         = require('bcryptjs')
const when           = require('when')
const flash          = require('connect-flash')
const app            = express()
const router         = express.Router()
const User           = require("./schema/user")
var LocalStrategy    = require('passport-local').Strategy

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.set('X-Powered-By', 'Blogger API')
  next()
})

app.use(session({ secret: config.get('session_secret'), key: 'user', cookie: { maxAge: new Date(253402300000000), secure: false }, resave: false, saveUninitialized: true }))

// passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(coookieParser());
app.use(flash()); // use connect-flash for flash messages stored in session
passport.use(new LocalStrategy((username, password, done) => {
  var query  = User.where({ username: username })
  query.findOne(function(err, userObject){
    return userObject;
  })
  .then((userObject) => {
    if (!userObject) {
      return done(null, false, {
        message: 'Incorrect username or password'
      });
    }
    verifyPassword(password, userObject.password)
    .then((flag) => {
      if(!flag){
        return done(null, false, {
          message: 'Incorrect password'
        });
      }
      else{
        return done(null, userObject);
      }
    })
  })
  .catch((error) => {
    return done(error)
  })
}))

passport.serializeUser((user, done) => {
  console.log("in serializeUser", user)
  done(null, user)
});

passport.deserializeUser((user, done) => {
  var query  = User.where({ uid: user.uid });
  query.findOne(function(err, userObject){
    return userObject
  })
  .then((user) => {
    done(null, user)
  })
  .catch((error) => {
    done(error, null)
  })
});

// parse application/json
app.use(bodyParser.json({
  limit: '25mb'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  limit: '25mb',
  extended: true
}));

app.get('/', function(req, res) {
  res.json("Welcome to " + config.get("projectName") + "! API is available at '/api/'");
});

//Load all other specific routes
app.use('/api', require('./routes')(router));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  res.status(404).send({
    error: req.url + ' : Not found'
  });
  next({
    error: req.url + ' : Not found'
  });
});

process.on('uncaughtException', (err) => {
  console.log('Caught exception: ' + err);
  console.log('Stack trace: ' + err.stack);
  if (process.send) process.send('offline')
    process.exit(0);
});

app.listen(8000, () => {
	require('./config/connection')
  if (process.send) process.send('online');
  console.log('Web server is listening at port 8000 in %s mode', app.get('env'))
});

var performCleanup = () => {
  console.log("server shutting down gracefully")
    // app.close()
  }

var verifyPassword = (password, hash) => {
  var deferred = when.defer()

  bcrypt.compare(password, hash, function(err, res) {
    if (err) deferred.reject(err)
    else deferred.resolve(res)
  });

  return deferred.promise
}
// listrn to app shutdown & Naught cleanup
process.on('message', (message) => {
  if (message === 'shutdown') {
    performCleanup();
    if (process.send) process.send('offline')
      process.exit(0);
  }
});