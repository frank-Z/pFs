/**
 * Created by frank-Z on 2017/2/23.
 * email ：1262445244
 */
const mysqlHelper = require('../app/common/mysqlHelper');
const baseFn = require('../app/utils/base');


// var a = {
//     u: "test",  //用户名称
//     n:"ssssd12424242",  //随机字符串 小于32位数
//     t :1487828469076,  //毫秒时间戳
//     f:"fnName",//方法名称
//     s:"wrfsdf3232421dsf34",//加密后的字符串
//     d: "{ssss:1}" //data obj
// };
//
const fnNo = '1002100';
module.exports = (opts) =>async(ctx, next) => {

    //参数解析
    const recieve = ctx.request.body;

    //返回报文初始化
    let out = {
        s: false,
        m: null,
        d: {},
        c: 0
    };

    //ip检查
    //todo.. fnNo+101

    //fnName检查
    //todo.. fnNo+103

    //基本参数检查
    let paramsError = _checkParamsError(recieve);
    if (!!paramsError) {
        out.c = fnNo + "105";
        out.m = paramsError;
        ctx.body = out;
        return;
    }

    //获取用户sign
    let user = await mysqlHelper.query('fs', "select * from user where name = ?", [recieve.u]);
    if (!user) {
        out.c = fnNo + "107";
        out.m = "用户不存在";
        ctx.body = out;
        return;
    }
    let sign = user[0].sign;

    //签名检查
    let signsError = _checkSignError(recieve, sign);
    if (!!signsError) {
        out.c = fnNo + "109";
        out.m = "签名检查错误";
        ctx.body = out;
        return;
    }

    //挂载业务数据
    ctx.data = ctx.data || {};
    ctx.data.postData = recieve.d;
    ctx.data.userInfo = user[0];
    await next();
};


//基本参数检查
const _checkParamsError = (opts) => {
    if (!opts.u) return "用户参数u丢失或不正确";
    if (!(opts.n && Object.prototype.toString.call(opts.n) === "[object String]" && opts.n.length <= 32)) return "随机字符串参数n丢失或不正确";
    if (!(opts.t && opts.t.toString().length === 13 && opts.t <= Date.now().valueOf())) return "时间戳参数t丢失或不正确";
    if (!opts.f) return "方法名参数f丢失或不正确";
    if (!opts.s) return "加密字符串参数s丢失或不正确";
    if (!(opts.d && Object.prototype.toString.call(opts.d) === "[object Object]")) return "数据参数d丢失或不正确";
    return 0;
};

//签名检查
const _checkSignError = (opts, sign) => {
    var str = [opts.n, opts.t, opts.f, sign].sort().join('');
    return baseFn.toMD5(str) !== opts.s;
};

