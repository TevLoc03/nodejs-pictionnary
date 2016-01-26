var mysql = require('mysql');
var logger = require('log4js').getLogger('Server');

// echap les caractere
var SqlString = require('sqlstring');

var pool =  mysql.createPool({
    connectionLimit : 100, //important
    host : 'localhost',
    user : 'test',
    password: 'test',
    database: 'pictionnary'
});

/**
 * echap les caracteres
 * @param value
 */
exports.escape = function(value) {
    return SqlString.escape(value, false);
};

/**
 * Requete type query
 * @param req
 * @param res
 * @param query
 * @param callback
 */
exports.query = function(req,res,query, callback) {

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            return callback({"erreur" : "Erreur de connection base de donnée"});
        }

        logger.debug('Connected as id ' + connection.threadId);
        logger.debug('Query : ' + query);

        connection.query(query,function(err,rows){
            connection.release();
            if(!err) {
                return callback(rows);
            }
        });

        connection.on('error', function(err) {
            return callback({"erreur" : "Erreur de connection base de donnée"});
        });
    });
};

