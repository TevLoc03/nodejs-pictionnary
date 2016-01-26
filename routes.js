/**
 * Created by Tev on 15/01/2016.
 */
var passport = require('passport');
var logger = require('log4js').getLogger('Server');

module.exports = function (app) {

    pool = require('./pool');

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/login'
    }));

    /**
     * Si l'utilisateur est rediriger soit vers login soit vers home si il est connecter
     */
    app.get('/', function (req, res) {
        if(req.session.authid){
            res.render('home', {auth:true});
        }else{
            res.redirect('/login');
        }
    });

    /**
     * Route pour la partie Login
     */
    app.route('/login')
        .get(pool.home_redirect);

    app.route('/login')
        .post(pool.login_verify);

    /**
     * Route pour la partie inscription
     */
    app.route('/subscribe')
        .get(pool.getSubscribe);

    app.route('/subscribe')
        .post(pool.postSubscribe);

    /**
     * Route pour deco
     */
    app.get('/signout', pool.signout);

    /**
     * Route pour l'accueil
     */
    app.route('/home')
        .get(pool.getHome);

    /**
     * Route pour paint (faire les dessins)
     */
    app.route('/paint')
        .get(pool.getPaint);

    app.route('/paint')
        .post(pool.postPaint);

    /**
     * Route pour suppression dessin
     */
    app.post('/deleteDessin', pool.deleteDessin);

    /**
     * Route pour suppression utilisateur
     */
    app.get('/deleteAccount', pool.deleteAccount);

};
