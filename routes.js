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
        if(req.session.auth){
            res.render('home', {auth:true});
        }else{
            res.redirect('/login');
        }
    });

    /**
     * Route pour la partie Login
     */
    app.get('/login', pool.home_redirect);

    app.post('/login', pool.login_verify);

    /**
     * Route pour la partie inscription
     */
    app.get('/subscribe', pool.getSubscribe);

    app.post('/subscribe', pool.postSubscribe);

    /**
     * Route pour deco
     */
    app.get('/signout', pool.signout);

    /**
     * Route pour l'accueil
     */
    app.get('/home', pool.getHome);

    /**
     * Route pour paint (faire les dessins)
     */
    app.get('/paint', pool.getPaint);

    app.post('/paint', pool.postPaint);

    /**
     * Route pour suppression dessin
     */
    app.post('/deleteDessin', pool.deleteDessin);

    /**
     * Route pour Revoir dessins
     */
    app.post('/guess', pool.postGuess);

    /**
     * Route pour suppression utilisateur
     */
    app.get('/deleteAccount', pool.deleteAccount);

    /**
     * Route pour edité utilisateur
     */
    app.get('/edit_user', pool.editUsers);
    app.post('/editConfirm', pool.editConfirm);

    /**
     * Route administration
     */
    app.get('/admin', pool.getAdmin);
    app.post('/admin', pool.postAdmin);
   // app.get('/deleteUser', pool.deleteUser);
};
