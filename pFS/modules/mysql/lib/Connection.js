/**
 * Created by frank-Z on 2017/2/22.
 * email ：1262445244
 */
const mysql = require('mysql');
const bluebird = require('bluebird');
const Promise = bluebird.Promise;
var $originConn = Symbol('originConn');
var $isPoolConn = Symbol('isPoolConn');
var $isAlive = Symbol('isAlive');

/**
 * This function is the factory of the standard promise callback.
 * @param {Function} resolve
 * @param {Function} reject
 * @return {Function} The standard promise callback.
 */
function promiseFn(resolve, reject) {
    return (err, rst) => {
        if (err) reject(err);
        else resolve(rst);
    }
}



/**
 * Connection is the class that contains functions that each returns promise.
 * These functions are just converted from a Mysql.Connection Object.
 */
class Connection {

    /**
     * Constructor, initialize the connection object.
     * @param {Object} config The configuration of the connection.
     * @param {Boolean} isPoolConn Orders the connection is in a pool or not.
     */
    constructor(config, isPoolConn = false) {
        if (config.query)
            this[$originConn] = config;
        else
            this[$originConn] = mysql.createConnection(config);
        this[$isPoolConn] = isPoolConn;
        this[$isAlive] = true;
    }

    /**
     * Connection config
     */
    get config() { return this[$originConn].config; }

    /**
     * Orders the connection is in a pool or not.
     */
    get isPoolConnection() { return this[$isPoolConn]; }

    /**
     * Orders the connection is destroyed or not.
     */
    get isAlive() { return this[$isAlive]; }

    /**
     * Orders the threadId of the connection.
     */
    get threadId() { return this[$originConn].threadId; }

    /**
     * Add listener of this connection.
     */
    get on() { return this[$originConn].on; };

    /**
     * Ternimate the connection immediately whether there's any query in quene or not.
     */
    destroy() {
        return new Promise((resolve, reject) => {
            this[$originConn].destroy();
            this[$isAlive] = false;
            resolve();
        });
    }

    /**
     * Ternimate the connection. This function will ternimate the connection after any query being complete.
     */
    end() {
        return new Promise((resolve, reject) => {
            this[$originConn].end(promiseFn(resolve, reject))
        })
            .then(() => {
                this[$isAlive] = false;
            })
    }

    /**
     * Execute sql command with parameters.
     * @param {String} cmd The sql command would be executed.
     * @param {Array} params Parameters.
     * @return {Promise<any>} The sql result.
     */
    query(cmd, params) {
        return new Promise((resolve, reject) => {
            let conn = this[$originConn];
            let args = [cmd];
            let callback = promiseFn(resolve, reject);
            if (params)
                args.push(params);
            args.push(callback);
            conn.query(...args);
        });
    }

    /**
     * Begin transaction of the connection. Following queries would not be useful until the function commit or rollback called.
     * @return {Promise<undefined>}
     */
    beginTran() {
        return new Promise((resolve, reject) => {
            let conn = this[$originConn];
            conn.beginTransaction(promiseFn(resolve, reject));
        });
    }

    /**
     * Commit a transaction.
     * @return {Promise<undefined>}
     */
    commit() {
        return new Promise((resolve, reject) => {
            let conn = this[$originConn];
            conn.commit((err) => {
                if (err) this.rollback().then(() => reject(err));
                else resolve();
            })
        });
    }

    /**
     * Rollback a transaction
     * @return {Promise<undefined>}
     */
    rollback() {
        return new Promise((resolve, reject) => {
            let conn = this[$originConn];
            conn.rollback(() => resolve());
        });
    }
}


/**
 * PoolConnection is the class extending from Connection.
 * Any object of this class is the connection in a connection pool.
 */
class PoolConnection extends Connection {
    constructor(originConn) {
        super(originConn, true);
    }

    /**
     * Release the connection and put it back to the pool.
     * @return {Promise<undefined>}
     */
    release() {
        return new Promise((resolve, reject) => {
            this[$originConn].release();
            resolve();
        });
    }
}



module.exports.Connection = Connection;
module.exports.PoolConnection = PoolConnection;