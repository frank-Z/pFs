/**
 * Created by frank-Z on 2017/2/23.
 * email ：1262445244
 */
var mysqlHelper = require('../../common/mysqlHelper');

//测试  fn
var testFn = async(ctx, next) => {
    console.log("query : " + JSON.stringify(ctx.query));
    console.log("body : " + JSON.stringify(ctx.request.body));
    var body = ctx.request.body;
    var user = await mysqlHelper.query('fs',"select * from user where name = ? ",['test']);
    ctx.body = {
        a: parseInt(body.a) + 100,
        b: parseInt(body.bbb) + 100,
        user: user[0],
        data:ctx.data.postData
    };
};

module.exports = {
    'POST /test3': testFn,
    'POST /test5': testFn,
};