/**
 * Created by frank-Z on 2017/2/22.
 * email ：1262445244
 */
//Use this test.js need node version is higher than 7.0.0 .
//And need the node arg "--harmony".

const config = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password":"a12345ASD",
    "database": "fs",
    "charset": "UTF8_GENERAL_CI",
    "timezone": "local",
    "connectTimeout": 10000,
    "connectionLimit": 10
};
const Pool = require('./lib/Pool').Pool;
const Connection = require('./lib/Connection').Connection;
var pool = new Pool(config);
//var conn = new Connection(config);

async function poolTest() {

    //pool.query()
    await pool.query('SELECT * FROM user WHERE u_name=?', ['hi']);

    pool.getConn();

    let poolConn = await pool.getConn();

    console.log(poolConn.isPoolConnection);

    await poolConn.query('SELECT * FROM mes WHERE id=?', [100]);
    await pool.end();
    console.log(pool.isAlive);
}

async function connTest(id) {

    try {
        let rst = await conn.query('SELECT * FROM user WHERE u_id=? for update', [id]);

        // if(rst[0].u_statue_id != 0){
        //     await conn.rollback();
        //     return new Error("状态不正确");
        // }
        await conn.end();
        console.log("isAlive : "+conn.isAlive);
        await conn.beginTran();

        await conn.query('update user set u_statue_id = 1,u_status_name = "激活" WHERE u_id=?', [id]);

        await conn.query('INSERT INTO mes(id,content,u_id) VALUES(?,?,?)', [1,2,3]);
        console.log("isAlive : "+conn.isAlive);
        await conn.commit();
        console.log("isAlive : "+conn.isAlive);
        return "ok";
    }catch (e){
        return e;
    }
}

//poolTest();
//connTest();

// async function test(id) {
//     console.log(2);
//     var a = await connTest(id);
//     console.log(3);
//     return a;
// }
//
// async function test1(id) {
//     console.log(1);
//     var a = await test(id);
//     console.log(4);
//     console.log('a : '+a);
//     console.log('typeofa : '+isError(a));
//     return a;
// }
//
// test1(5);
var query = async (dbName,sql,params)=>{
    console.log(1)
    try {
        console.log(222)
        var con = new Connection(config);
        console.log(333)
        var need = await con.query(sql,params);
        console.log(2)
        await con.end();
        console.log(3)
        console.log(need)
        return need;
    }catch (e){
        return e
    }
};

query('fs',"select * from user where name = ? ",['test']);