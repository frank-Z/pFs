/**
 * Created by frank-Z on 2017/2/21.
 * email ：1262445244
 */
const Koa = require('koa');
const path = require('path');
//const bodyParser = require('./filter/bodyParser');
const bodyParser = require('koa-bodyparser');
const requestLog = require('./filter/requestLog');
const generalParamsFilter = require('./filter/generalParamsFilter');
const controller=require('./controller');


const app = new Koa();

//添加全局扩展函数
const fnExtend = require('./filter/fnExtend');
fnExtend.config();

global.ROOT_DIR = path.join( process.argv[1] || __dirname, "../");
global.FILES_DIR = path.normalize( ROOT_DIR + "/files/");

app.use(requestLog);
app.use(bodyParser());  //只解析x-www-form-urlencoded的数据
app.use(generalParamsFilter());


app.use(controller("/app/actions/"));

// 在端口3000监听:
app.listen(3000, function () {
    console.log('app started at port 3000...');
});


