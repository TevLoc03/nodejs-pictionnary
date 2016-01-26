var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session'); // Pour la session
var authid
/**
 * Connexion au service tiers
 */
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '1680611765490170';
var FACEBOOK_APP_SECRET = '1cd848b2916d3e8f8818d18d004b1ea4';

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:1313/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        //Assuming user exists
        done(null, profile);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/**
 * package qui permettra de valider le formulaire
 * @type {exports|module.exports}
 */
var validator = require('validator');

/**
 * templates
 */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * clé secrete session
 */
app.use(session({secret: 'aka47famas12tevtevledev2a93',
    resave: true,
    saveUninitialized: true}));

app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

logger.info('server start');

/**
 * recuperation des routes
 */
require('./routes')(app);

app.listen(1313);