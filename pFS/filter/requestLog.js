/**
 * Created by frank-Z on 2017/2/21.
 * email ：1262445244
 */

module.exports = async(ctx, next) => {
    if(ctx.request.url == "/favicon.ico") {
        ctx.response.body = '';
    }else {
        console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
        var start = new Date().getTime(), execTime;
        await next();
        execTime = new Date().getTime() - start;
        ctx.response.set('X-Response-Time', `${execTime}ms`);
    }
};