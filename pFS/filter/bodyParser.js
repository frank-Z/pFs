/**
 * Created by frank-Z on 2017/2/22.
 * email ：1262445244
 */
var querystring = require('querystring');
var getRawBody = require('raw-body');


module.exports = (opts)=>async(ctx, next)=> {

    const _method = ctx.method.toUpperCase();

    if (_method !== 'POST') return await next();

    //_method === 'POST'
    const _type = ctx.request.headers['content-type'];

    if (_type.indexOf( 'x-www-form-urlencoded') === -1) return await next();

    //只解析x-www-form-urlencoded的数据
    ctx.req.length = ctx.req.headers['content-length'];
    var content = await getRawBody(ctx.req, {
        length: ctx.req.length,
        limit: '1mb',
        encoding:"utf8"
    });

    ctx.request.body = querystring.parse(content);

    await next();
};


// const urlencoded =(ctx)=> {
//     console.log("start");
//     console.log("Promise" + typeof Promise);
//     return new Promise((resolve,reject) => {
//         var data = new Buffer();
//         ctx.req.on("data", (buf)=> {
//             console.log("data : " + JSON.stringify(querystring.parse(buf.toString())));
//             data += buf;
//         });
//         ctx.req.on("end", ()=> {
//             console.log("end")
//             ctx.req.body = querystring.parse(data.toString() || {});
//             resolve();
//         });
//         ctx.req.on("error", (err)=>{
//             console.log("error")
//             reject();
//         });
//     });
// };
//
// const otherParser = (ctx)=> {
//     var data = new Buffer();
//     ctx.req.on("data", (buf)=>data += buf);
//     ctx.req.on("end", ()=>ctx.req.body = data.toString());
// };
//
// const multipart = async(ctx, dir)=> {
//     var form = formidable.IncomingForm();
//     if (!!dir) {
//         form.uploadDir = normalize(process.cwd() + dir);
//     }
//     return await  form.parse(ctx.request);
// };