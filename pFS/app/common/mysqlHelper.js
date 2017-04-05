/**
 * Created by frank-Z on 2017/2/23.
 * email ：1262445244
 */
const mysqlModules = require('../../modules/mysql');
const Connection = mysqlModules.Connection;
const Pool = mysqlModules.Pool;

var query = async(dbName, sql, params)=> {
    try {
        var con = new Connection(require('../../config/mysqlConf')[dbName]);
        var need = await con.query(sql, params);
        await con.end();
        return need;
    } catch (e) {
        return e
    }
};

var createCon = async(dbName)=> {
    try {
        const con = new Connection(require('../../config/mysqlConf')[dbName]);
        await con.beginTran();
        return con;
    } catch (e) {
        return e
    }
};

var createPool = async(dbName)=> {
    try {
        const pool = new Pool(require('../../config/mysqlConf')[dbName]);
        await pool.getConn();
        return pool;
    } catch (e) {
        return e
    }
};


module.exports = {
    query: query,
    createCon: createCon,
    createPool: createPool
};