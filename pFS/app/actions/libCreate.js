/**
 * Created by frank-Z on 2017/2/27.
 * email ：1262445244
 */
const fileBusiness = require('../business/fileBusiness');
const baseFn = require('../utils/base');

//lc 文件夹创建接口
const fnNo = "1002201";
const libCreate = async(ctx, next) => {
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
        const pid = postData.pid || 0;
        const libName = postData.libName;
        const uid = userInfo.id;

        //若非root目录
        if (pid > 0) {
            //检查parent库是否存在
            const hasLibId = await fileBusiness.checkHasLibIdOrNot(uid, uSign, pid);
            if (!hasLibId) {
                out.c = fnNo + "105";
                out.m = "没找到库，其pid是：" + pid;
                ctx.body = out;
                return;
            }
        }

        //检查该库下是否存在同名库
        const hasFile = await fileBusiness.checkHasLibNameOrNot(uid, uSign, pid, libName);
        if (!!hasFile) {
            out.c = fnNo + "107";
            out.m = "该库下已有同名库，其parent库id是：" + pid + ",已有库名称是： " + libName;
            ctx.body = out;
            return;
        }

        //添加库
        const insertId = await fileBusiness.addNewLib(uid,uSign,pid,libName);
        if (!!insertId) {
            out.m = "成功";
            out.d = {
                libId: insertId //文件访问基本路径
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
    'POST /post/lc': libCreate
};

//参数检查
const _checkParamsError = (opts)=> {
    if (!(opts.uSign && _isStringAndLess30(opts.uSign))) return "业务参数uSign丢失或不正确";
    if (!(opts.libName && _isStringAndLess30(opts.libName))) return "业务参数libName丢失或不正确";
    if (opts.pid && !(baseFn.isNumber(opts.pid)||baseFn.isString(opts.pid))) return "业务参数pid格式不正确";
    return 0;
};

//是字符串且小于30位
const _isStringAndLess30 = (s)=>baseFn.isString(s) && s.length <= 30;

//
// var d = {
//     uSign:"testA", //用户标识（）
//     pid: 0, //库ID  （默认root目录）
//     libName:"123"//库名称
// };