/**
 * Created by frank-Z on 2017/2/24.
 * email ：1262445244
 */
const fileBusiness = require('../business/fileBusiness');

//frs 文件接收接口 （单个）
const fnNo = "1002301";
const fileReceiveSingle = async(ctx, next) => {
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
        const fileName = postData.fileName;
        const uid = userInfo.id;

        //检查库是否存在
        const hasLib = await fileBusiness.checkHasLibIdOrNot(uid, uSign, libId);
        if (!hasLib) {
            out.c = fnNo + "105";
            out.m = "没找到库，其id是：" + libId;
            ctx.body = out;
            return;
        }

        //检查文件是否存在
        const hasFile = await fileBusiness.checkHasFileNameOrNot(uid, uSign, libId, fileName);
        if (!!hasFile) {
            out.c = fnNo + "107";
            out.m = "该库下已有同名文件，其库id是：" + libId+",其文件名称是： "+fileName;
            ctx.body = out;
            return;
        }

        //文件储存
        const isOK = await fileBusiness.saveFileSingle(uid, postData);
        if(!!isOK){
            out.m = "成功";
            out.d = {
                url: "/"+ libId + "/" + fileName //文件访问基本路径
            };
            ctx.body = out;
        }else {
            out.c = fnNo + "109";
            out.m = "系统错误，原因是：" + "文件储存失败";
            ctx.body = out;
        }
    } catch (e) {
        out.c = fnNo + "109";
        out.m = "系统错误，原因是：" + e;
        ctx.body = out;
    }

};

module.exports = {
    'POST /post/frs': fileReceiveSingle
};

//参数检查
const _checkParamsError = (opts)=> {
    if (!(opts.type && ["buffer", "utf8"].indexOf(opts.type) !== -1)) return "业务参数type丢失或不正确";
    if (!opts.str) return "业务参数str丢失或不正确";
    if (!(opts.uSign && _isStringAndLess30(opts.uSign))) return "业务参数uSign丢失或不正确";
    if (!(opts.libId && _isStringAndLess30(opts.libId))) return "业务参数libId丢失或不正确";
    if (!(opts.fileName && _isStringAndLess30(opts.fileName))) return "业务参数fileName丢失或不正确";
    if (!(opts.ext && _isStringAndLess30(opts.ext) && opts.ext[0] != ".")) return "业务参数ext丢失或不正确";
    return 0;
};

//是字符串且小于30位
const _isStringAndLess30 = (s)=>Object.prototype.toString.call(s) === "[object String]" && s.length <= 30;

//
// var d = {
//     type: "buffer", //文件流格式  buffer utf8
//     str: "ddddsssaaaaa", //文件流内容
//     uSign:"13zasdsad2321", //用户标识（）
//     libId:"123",//库id
//     fileName:"fileNameTest", //文件名称
//     ext:"txt"
// };