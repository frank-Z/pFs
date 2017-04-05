/**
 * Created by frank-Z on 2017/2/28.
 * email ：1262445244
 */
/**
 * Created by frank-Z on 2017/2/27.
 * email ：1262445244
 */
const fileBusiness = require('../business/fileBusiness');
const baseFn = require('../utils/base');

//ld 文件夹删除
const fnNo = "1002207";
const libDelete = async(ctx, next) => {
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
        const uid = userInfo.id;

        //检查库id是否存在
        const hasLibId = await fileBusiness.checkHasLibIdOrNot(uid, uSign, libId);
        if (!hasLibId) {
            out.c = fnNo + "105";
            out.m = "没找到库，其库id是：" + libId;
            ctx.body = out;
            return;
        }

        //获取pid下所有的id
        let libIdArr = await fileBusiness.getLibIdArrByPid(uid,uSign,[libId],[]);
        console.log(libIdArr)

        //let deleteOk = await fileBusiness.deleteAllByLibIds




    } catch (e) {
        out.c = fnNo + "109";
        out.m = "系统错误，原因是：" + e;
        ctx.body = out;
    }

};

module.exports = {
    'POST /post/ld': libDelete
};

//参数检查
const _checkParamsError = (opts)=> {
    if (!(opts.uSign && _isStringAndLess30(opts.uSign))) return "业务参数uSign丢失或不正确";
    if (!(opts.libName && _isStringAndLess30(opts.libName))) return "业务参数libName丢失或不正确";
    if (opts.pid && !(baseFn.isNumber(opts.pid) || baseFn.isString(opts.pid))) return "业务参数pid格式不正确";
    return 0;
};

//是字符串且小于30位
const _isStringAndLess30 = (s)=>baseFn.isString(s) && s.length <= 30;

//
// var d = {
//     uSign:"testA", //用户标识（）
//     libId: 0, //库ID
// };