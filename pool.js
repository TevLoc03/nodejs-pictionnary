var validator = require('validator');
var mysql = require('./connectDb');
var logger = require('log4js').getLogger('Server');

//hash pour le mdp
var sha256 = require('sha256');

/**
 * Recuperation des dessins selon l'utilisateur
 * @param req
 * @param res
 */
exports.getHome = function (req, res) {
    sql = "SELECT id, nom_dessin FROM draws WHERE id_user = " + req.session.auth.id;
    mysql.query(req, res, sql, function (response) {
        dessin = response;

        res.render('home', {auth:true, dessins : dessin, user: req.session.auth, photo: picture});
    });
};

/**
 * Partie Connexion
 * @param req
 * @param res
 */
exports.home_redirect = function(req, res){
    if(req.session.auth){
        res.redirect('/home');
    }else{
        res.render('login', {errors: []});
    }
};

exports.login_verify = function(req, res){
    if(req.session.auth) {
        res.redirect('/home');
    } else {
        errors = [];

        // Verification des champs
        if (!validator.isEmail(req.body.email))
            errors[errors.length] = "Email invalide";
        if (!validator.isAlphanumeric(req.body.password))
            errors[errors.length] = "Mot de passe invalide";

        // S'il y a des erreurs on les affiches dans la page home
        if (errors.length != 0)
            res.render('login', {errors: errors});
        else {
            // création de la requete SQL
            sql = 'SELECT * FROM users WHERE email = ' + mysql.escape(req.body.email) + ' AND password = ' + mysql.escape(sha256(req.body.password));

            // Sinon on regarde si l'utilisateur existe dans la base de donnée
            mysql.query(req, res, sql, function (response) {
                if (response.length != 1) {
                    res.render('login', {errors: ['Email ou mot de passe incorrect.']});
                } else {
                    req.session.auth = response[0];
                    picture = req.session.auth.profilepic.toString('utf8');
                    res.redirect('/home');
                }
            });
        }
    }
};

/**
 * Partie Inscription
 * @param req
 * @param res
 */
exports.getSubscribe = function(req, res){
    if(req.session.auth){
        res.redirect('/home');
    }else{
        res.render('subscribe', {errors: [], data : req.body});
    }
};

exports.postSubscribe = function(req, res){
    if(req.session.auth)
        res.redirect('/home');
    else {
        errors = [];

        // Verification des champs
        if (!validator.isEmail(req.body.email))
            errors[errors.length] = "Email invalide";
        if (!validator.isAlphanumeric(req.body.password))
            errors[errors.length] = "Mot de passe invalide";
        if (!validator.isAlpha(req.body.nom) && !validator.isNull(req.body.nom))
            errors[errors.length] = "Nom invalide";
        if (!validator.isAlpha(req.body.prenom))
            errors[errors.length] = "Prenom invalide";
        if (!validator.isMobilePhone(req.body.tel, 'fr-FR') && !validator.isNull(req.body.tel) )
            errors[errors.length] = "Téléphone invalide";
        if (!validator.isURL(req.body.sw,{ protocols: ['http','https']}) && !validator.isNull(req.body.sw) )
            errors[errors.length] = "Url invalide";
        if (req.body.sexe != "H" && req.body.sexe != "F" && req.body.sexe != null)
            errors[errors.length] = "Sexe invalide ";
        if (!validator.isDate(req.body.anniv))
            errors[errors.length] = "Date de Naissance invalide";
        if (!validator.isAlpha(req.body.ville) && !validator.isNull(req.body.ville) )
            errors[errors.length] = "Ville invalide";
        if (!validator.isFloat(req.body.taille,{ min: 0, max: 2.50 }))
            errors[errors.length] = "Taille invalide";
        if (!validator.isHexColor(req.body.couleur) && !validator.isNull(req.body.couleur) )
            errors[errors.length] = "Couleur invalide";
        if (!validator.isAlphanumeric(req.body.password))
            errors[errors.length] = "Mot de passe invalide";
        if (!typeof req.body.photo)
            errors[errors.length] = "Photo invalide";

        // S'il y a des erreurs on les affiches dans la page home
        if (errors.length != 0) {
            res.render('subscribe', {errors: errors, data : req.body});
        } else {

            sql = 'SELECT id FROM users WHERE email = ' + mysql.escape(req.body.email) ;
            mysql.query(req, res, sql, function(response){

               if(response.length != 0){
                   res.render('subscribe', {errors: ['Email  deja existant.'], data : req.body});
               }else{

                    // création de la requete SQL
                    sql = 'INSERT INTO users (email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic)' +
                        ' VALUES ( ' +
                        mysql.escape(req.body.email) + ', ' +
                        mysql.escape(sha256(req.body.password)) + ', ' +
                        mysql.escape(req.body.nom) + ', ' +
                        mysql.escape(req.body.prenom) + ', ' +
                        mysql.escape(req.body.tel) + ', ' +
                        mysql.escape(req.body.sw) + ', ' +
                        mysql.escape(req.body.sexe) + ', ' +
                        mysql.escape(req.body.anniv) + ', ' +
                        mysql.escape(req.body.ville) + ', ' +
                        mysql.escape(req.body.taille) + ', ' +
                        mysql.escape(req.body.couleur) + ',' +
                        mysql.escape(req.body.photo) + ')';


                    mysql.query(req, res, sql, function (response) {

                        sql = "SELECT * FROM users WHERE id=" + response.insertId;

                        mysql.query(req, res, sql, function (response) {
                            if (response.length != 1) {
                                res.render('login');
                            } else {
                                req.session.auth = response[0];
                                picture = req.session.auth.profilepic.toString('utf8');
                                logger.error(req.session.auth);
                                res.redirect('/home');
                            }
                        });

                    });
               }
            });
        }
    }
};

/**
 * Partie Deconnexion
 * @param req
 * @param res
 */
exports.signout = function(req, res){
    if(req.session.auth){
        req.session.destroy(function(err) {
            if (err)
                logger.error(err);
            else
                res.redirect('/');
        });
    }else{
        res.redirect('/login');
    }
};

/**
 * Pour la création du dessin
 * @param req
 * @param res
 */
exports.getPaint = function(req, res){
    if(!req.session.auth){
        res.redirect('/login');
    }else{
        res.render('paint', {auth: true});
    }
};

exports.postPaint = function(req, res){
        if(req.session.auth) {
            sql = 'INSERT INTO draws (id_user, commandes, dessin, nom_dessin) VALUES (' +
                mysql.escape(req.session.auth.id) + ', ' +
                mysql.escape(req.body.commands) + ', ' +
                mysql.escape(req.body.picture) + ', ' +
                mysql.escape(req.body.nom_dessin) + ')';

            mysql.query(req, res, sql, function (response) {
               if (response.affectedRows != 1) {
                    res.render('paint');
               } else {
                    res.redirect('/home');
                 }
            });
        }else {
            res.redirect('/login');
        }
};

/**
 * Suppression dessin
 * @param req
 * @param res
 */
exports.deleteDessin = function(req, res){
    sql = 'DELETE FROM draws WHERE id='+ req.body.id_delete_dessin;
    mysql.query(req, res, sql, function(response){
        if(response.affectedRows != 1){

        }else {
            res.redirect('/home');
        }
    });
};

/**
 * Revoir dessin
 * @param req
 * @param res
 */
exports.postGuess = function(req, res) {
    if(!req.session.auth){
        res.redirect('/login');
    }else{
        sql = 'SELECT nom_dessin, commandes FROM draws WHERE id =' + req.body.id_view_dessin;
        mysql.query(req, res, sql, function(response){
            if(!response){
                res.redirect('/login');
            }
            else {
                comm = response[0].commandes;
                nom = response[0].nom_dessin;
                res.render('guess', {auth: true, command : comm, nom_dessin: nom});
            }
        });

    }
};

/**
 * Suppression utilisateurs
 * @param req
 * @param res
 */
exports.deleteAccount = function(req, res){
    sql_user = 'DELETE FROM users WHERE id='+ req.session.auth.id;
    mysql.query(req, res, sql_user, function(response){
        if(response.affectedRows != 1){

        }else {
            sql_draw = 'DELETE FROM draws WHERE id_user='+ req.session.auth.id;
            mysql.query(req, res, sql_draw, function(response){
                logger.debug(response);
                if(response.affectedRows != 1){
                    req.session.destroy(function (err) {
                        if (err)
                            logger.error(err);
                        else
                            res.redirect('/login');
                    });
                }
                else {
                    req.session.destroy(function (err) {
                        if (err)
                            logger.error(err);
                        else
                            res.redirect('/login');
                    });
                }
            });

        }
    });
};

/**
 * Pour la modification de profil
 * @param req
 * @param res
 */
exports.editUsers = function(req, res) {
    sql_edit = 'SELECT * FROM users WHERE id=' + req.session.auth.id;
    mysql.query(req, res, sql_edit, function (response) {
        if (response.length == 0) {
            res.redirect('/home');
        }
        else {
            res.render('edit_user', {data: response[0], succes:[]});
        }
    });
};

exports.editConfirm = function(req, res){
        // création de la requete SQL
        sql = 'UPDATE users ' +
            'SET email = '+ mysql.escape(req.body.email) +','+
            ' password = '+  mysql.escape(sha256(req.body.password)) +','+
            ' nom = '+  mysql.escape(req.body.nom) +','+
            ' prenom = '+  mysql.escape(req.body.prenom) +','+
            ' tel = '+  mysql.escape(req.body.tel) +','+
            ' website = '+  mysql.escape(req.body.sw) +','+
            ' sexe = '+  mysql.escape(req.body.sexe) +','+
            ' birthdate = '+  mysql.escape(req.body.anniv) +','+
            ' ville = '+  mysql.escape(req.body.ville) +
            ' WHERE id='+ req.session.auth.id;

        mysql.query(req, res, sql, function (response) {
            if (response.length == 0) {

            }
            else {
                sql = 'SELECT * FROM users WHERE id=' + req.session.auth.id;
                mysql.query(req, res, sql, function (response) {
                    req.session.auth = response[0];
                    res.render('edit_user', {succes: 'Modifications réussies!', data: req.body});
                });
            }
        });
};

/**
 * Pour administration
 * @param req
 * @param res
 */
exports.getAdmin = function(req, res){
    if(!req.session.auth){
        res.redirect('/login');
    }else{
        sql = "SELECT * FROM users WHERE id <> "+ req.session.auth.id;
        mysql.query(req, res, sql, function (response) {
            user = response;
            logger.info(user);
            res.render('admin', {auth:true, users : user});
        });
    }
};

exports.deleteUser = function(req, res){
    sql_user = 'DELETE FROM users WHERE id='+ req.body.id_delete_user;
    mysql.query(req, res, sql_user, function(response){
        if(response.affectedRows != 1){

        }else {
            sql_draw = 'DELETE FROM draws WHERE id_user='+ req.body.id_delete_user;
            mysql.query(req, res, sql_draw, function(response){
                logger.debug(response);
                if(response.affectedRows != 1){
                    res.redirect('/admin');
                }
                else {
                    res.redirect('/admin');
                }
            });

        }
    });
};