/**
 * Created by frank-Z on 2017/2/27.
 * email ：1262445244
 */
const fileBusiness = require('../business/fileBusiness');
const baseFn = require('../utils/base');
const mysqlHelper = require('../common/mysqlHelper');

//lu 文件夹修改
const fnNo = "1002203";
const libUpdate = async(ctx, next) => {
    //参数解析
    const postData = ctx.data.postData;
    const userInfo = ctx.data.userInfo;

    //返回报文初始化
    let out = {
        s: false,
        m: null,
        d: {},
        c: 0
    };

    try {
        //参数检查
        let paramsError = _checkParamsError(postData);
        if (!!paramsError) {
            out.c = fnNo + "103";
            out.m = paramsError;
            ctx.body = out;
            return;
        }

        //参数解析
        const uSign = postData.uSign;
        const libId = postData.libId;
        const libName = postData.libName;
        const uid = userInfo.id;

        //检查库是否存在
        const hasLibId = await fileBusiness.checkHasLibIdOrNot(uid, uSign, libId);
        if (!hasLibId) {
            out.c = fnNo + "105";
            out.m = "没找到库，其库id是：" + libId;
            ctx.body = out;
            return;
        }

        const libInfo = await mysqlHelper.query('fs', "select * from library where l_id = ? ", [libId]);
        const pid = libInfo[0].l_pid;
        const l_name = libInfo[0].l_name;

        //未改 提交
        console.log(l_name,libName);
        if(l_name === libName){
            out.m = "成功";
            out.d = {
            };
            ctx.body = out;
            return;
        }

        //检查该库下是否存在同名库
        const hasSameLib = await fileBusiness.checkHasLibNameOrNot(uid, uSign, pid, libName);
        if (!!hasSameLib) {
            out.c = fnNo + "107";
            out.m = "该库下已有同名库，其parent库id是：" + pid + ",已有库名称是： " + libName;
            ctx.body = out;
            return;
        }

        //修改库名称
        const affectRows = await fileBusiness.updateLibName(uid, uSign, libId, libName);
        if (!!affectRows) {
            out.m = "成功";
            out.d = {
                //libId: insertId //文件访问基本路径
            };
            ctx.body = out;
        } else {
            out.c = fnNo + "109";
            out.m = "系统错误，原因是：" + "系统繁忙";
            ctx.body = out;
        }
    } catch (e) {
        out.c = fnNo + "109";
        out.m = "系统错误，原因是：" + e;
        ctx.body = out;
    }

};

module.exports = {
    'POST /post/lu': libUpdate
};

//参数检查
const _checkParamsError = (opts)=> {
    if (!(opts.uSign && _isStringAndLess30(opts.uSign))) return "业务参数uSign丢失或不正确";
    if (!(opts.libName && _isStringAndLess30(opts.libName))) return "业务参数libName丢失或不正确";
    if (!(opts.libId && (baseFn.isNumber(opts.libId) || baseFn.isString(opts.libId)))) return "业务参数libId丢失或不正确";
    return 0;
};

//是字符串且小于30位
const _isStringAndLess30 = (s)=>baseFn.isString(s) && s.length <= 30;

//
// var d = {
//     uSign:"testA", //用户标识（）
//     libId: 123, //库ID
//     libName:"1233333"//库名称
// };