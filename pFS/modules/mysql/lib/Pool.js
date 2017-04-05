/**
 * Created by frank-Z on 2017/2/22.
 * email ：1262445244
 */
const Promise = require('bluebird').Promise;
const mysql = require('mysql');
const PoolConnection = require('./Connection').PoolConnection;
var $originPool = Symbol('originPool');
var $isAlive = Symbol('isAlive');


/**
 * Pool is the class that contains functions each returns promise.
 * These functions are just converted from the Mysql.Pool object.
 */
class Pool {

    /**
     * Constructor, initialize the pool.
     * @param {Object} config The pool config.
     */
    constructor(config) {
        this[$originPool] = mysql.createPool(config);
        this[$isAlive] = true;
    }

    /**
     * Orders the pool config.
     */
    get config() { return this[$originPool].config; }

    /**
     * Orders the pool is destroyed or not.
     */
    get isAlive() { return this[$isAlive]; }

    /**
     * Add listener to the pool.
     */
    get on() { return this[$originPool].on; }

    /**
     * Get a connection object from the pool.
     * @return {Promise<PoolConnection>}
     */
    getConn() {
        return new Promise((resolve, reject) => {
            this[$originPool].getConnection((err, originConn) => {
                if (err)
                    return reject(err);
                let conn = new PoolConnection(originConn);
                resolve(conn);
            });
        });
    }

    /**
     * Ternimate the pool. This function would ternimate the pool after any query being complete.
     */
    end() {
        return new Promise((resolve, reject) => {
            this[$originPool].end((err) => {
                if (err)
                    return reject(err);
                this[$isAlive] = false;
                resolve();
            })
        });
    }

    /**
     * Use a connection to query a sql command with parameters.
     * @param {String} cmd The sql command would be executed.
     * @param {Array} params Parameters.
     * @return {Promise<any>}
     */
    query(cmd, params) {
        return new Promise((resolve, reject) => {
            let args = [cmd];
            let callback = (err, rst) => {
                if (err) reject(err);
                else resolve(rst);
            };
            if (params)
                args.push(params);
            args.push(callback);
            this[$originPool].query(...args);
        });
    }
}



module.exports.Pool = Pool;