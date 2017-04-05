/**
 * Created by frank-Z on 2017/2/24.
 * email ：1262445244
 */
const promisify = require('bluebird').promisify;
// const mkdirP = promisify(require('fs').mkdir);
// const existsP = promisify(require('fs').exists);
const fs = require('fs');
const path = require('path');
const baseFn = require('../utils/base');

const mysqlHelper = require('../common/mysqlHelper');

/**
 * 检查库是否存在
 * @param uid {Number} 系统用户(下游用户)id
 * @param u_uid  {String} 系统用户(下游用户)的 用户唯一标识
 * @param lib_id {Number} 库id
 * @return {Promise}
 */
const checkHasLibIdOrNot = async(uid, u_uid, lib_id)=> {
    try {
        const sql = "select l_id from library where l_u_id=? and l_u_uname = ? and l_id = ?";
        const params = [uid, u_uid, parseInt(lib_id)];
        const lib = await mysqlHelper.query("fs", sql, params);
        return lib.length;
    } catch (e) {
        return e;
    }
};

/**
 * 检查库中文件是否存在
 * @param uid {Number} 系统用户(下游用户)id
 * @param u_uid {String} 系统用户(下游用户)的 用户唯一标识
 * @param lib_id {Number} 库id
 * @param filename {String} 文件名称
 * @return {Promise}
 */
const checkHasFileNameOrNot = async(uid, u_uid, lib_id, filename)=> {
    try {
        const sql = "select f_id from file where f_u_id=? and f_u_uname = ? and f_u_ulib = ? and f_name = ?";
        const params = [uid, u_uid, lib_id, filename];
        const file = await mysqlHelper.query("fs", sql, params);
        return file.length;
    } catch (e) {
        return e;
    }
};

/**
 * 检查库下面 是否有相同名称的库
 * @param uid {Number} 系统用户(下游用户)id
 * @param uSign {String} 系统用户(下游用户)的 用户唯一标识
 * @param pid {Number}  库 parent id
 * @param libName {String} 库名称
 * @return {Promise}
 */
const checkHasLibNameOrNot = async(uid, uSign, pid, libName)=> {
    try {
        const sql = "select l_id from library where l_u_id=? and l_u_uname = ? and l_pid = ? and l_name = ?";
        const params = [uid, uSign, pid, libName];
        const lib = await mysqlHelper.query("fs", sql, params);
        return lib.length;
    } catch (e) {
        return e;
    }
};

/**
 * 获取目录下文件列表
 * @param uid  {Number}  系统用户(下游用户)id
 * @param uSign {String}  用户唯一标识
 * @param libId {Number}  库id
 */
const getLibInnerFiles = async(uid, uSign, libId)=> {
    try {
        const sql = "select * from file where f_u_id=? and f_u_uname = ? and f_u_ulib = ?";
        const params = [uid, uSign, libId];
        return await mysqlHelper.query("fs", sql, params);
    } catch (e) {
        return e;
    }
};

/**
 * 获取目录下目录列表
 * @param uid  {Number}  系统用户(下游用户)id
 * @param uSign {String}  用户唯一标识
 * @param libId {Number}  库id
 */
const getLibInnerLibs = async(uid, uSign, libId)=> {
    try {
        const sql = "select * from library where l_u_id=? and l_u_uname = ? and l_pid = ?";
        const params = [uid, uSign, libId];
        return await mysqlHelper.query("fs", sql, params);
    } catch (e) {
        return e;
    }
};

/**
 * 单文件储存
 * @param uid {Number} 系统用户(下游用户)id
 * @param opts 业务参数
 * var postData = {
 *     type: "buffer", //文件流格式  buffer utf8
 *     str: "ddddsssaaaaa", //文件流内容
 *    userName:"testA", //用户标识（）
 *     libId:"123",//库id
 *    fileName:"fileNameTest", //文件名称
 *    ext:"txt"
 *};
 */
const saveFileSingle = async(uid, opts)=> {
    //参数解析
    const uSign = opts.uSign; //系统用户(下游用户)的 用户唯一标识
    const libId = opts.libId;   //用户库ID
    const fileName = opts.fileName;  //文件名称
    const type = opts.type || "utf8";  //流格式
    //const str = opts.str;   //流
    const ext = opts.ext;   //文件后缀（不带点）

    let timeArr = _createTimeArr();
    var fileRealName = timeArr.pop();

    try {
        //目录生成
        const _dir = await _createFoldersP(FILES_DIR, timeArr);
        const _realPath = path.normalize(_dir + '/' + fileRealName + '.' + ext);
        //文件储存
        fs.appendFileSync(_realPath, opts.str, type);

        //添加file记录
        const f_url = _realPath.split(FILES_DIR)[1];
        const f_hash = baseFn.toMD5(f_url);
        const fileSql = "INSERT INTO file(f_name,f_u_id,f_u_uname,f_u_ulib,f_url,f_hash,last_at,create_at) VALUES (?,?,?,?,?,?,now(),now())";
        const fileParams = [fileName, uid, uSign, libId, f_url, f_hash];
        const affectInfo = await mysqlHelper.query('fs', fileSql, fileParams);
        return affectInfo.affectedRows == 1 ? "ok" : null;

    } catch (e) {
        return e;
    }
};

/**
 * 获取目录下资源列表
 * @param uid  {Number}  系统用户(下游用户)id
 * @param uSign {String}  用户唯一标识
 * @param libId {Number}  库id
 */
const getLibInnerList = async(uid, uSign, libId)=> {
    try {
        let files = await getLibInnerFiles(uid, uSign, libId);
        let libs = await getLibInnerLibs(uid, uSign, libId);

        var arr = [];
        files.forEach(function (file) {
            arr.push({
                type: "0",
                name: file.f_name,
                id: file.f_hash
            })
        });
        libs.forEach(function (lib) {
            arr.push({
                type: "1",
                name: lib.l_name,
                id: lib.l_id
            })
        });

        return arr;
    } catch (e) {
        return e;
    }
};

/**
 * 获取目录下所有目录
 * @param uid  {Number}  系统用户(下游用户)id
 * @param uSign {String}  用户唯一标识
 * @param pidArr {Array}  pid 数组
 * @param gatherArr {Array}  返回的gather数组
 */
const getLibIdArrByPid = async(uid, uSign, pidArr, gatherArr)=> {
    try {
        if (pidArr.length == 0) {
            return gatherArr;
        }
        gatherArr = gatherArr.concat(pidArr);
        let sql = "select l_id id from library where l_u_id = ? and l_u_uname = ? and l_pid IN(";
        let params = [uid, uSign];
        pidArr.forEach(function (id) {
            sql += id + ',';
            params.push(id);
        });
        sql = sql.slice(0, -1);
        sql += ")";
        let libList = await mysqlHelper.query('fs', sql, params);
        let nextPidArr = [];
        libList.forEach(function (ele) {
            nextPidArr.push(ele.id);
        });
        return await getLibIdArrByPid(uid, uSign, nextPidArr, gatherArr);
    } catch (e) {
        return e
    }
};

/**
 * 添加 库
 * @param uid {Number} 系统用户(下游用户)id
 * @param uSign {String} 系统用户(下游用户)的 用户唯一标识
 * @param pid {Number}  库 parent id
 * @param libName {String} 库名称
 * @return {Promise}
 */
const addNewLib = async(uid, uSign, pid, libName)=> {
    try {
        const sql = "insert into library(l_name,l_u_id,l_u_uname,l_pid,last_at,create_at) values (?,?,?,?,now(),now())";
        const params = [libName, uid, uSign, pid];
        const addInfo = await mysqlHelper.query("fs", sql, params);
        return addInfo.insertId;
    } catch (e) {
        return e;
    }
};

/**
 * 修改 库 名称
 * @param uid {Number} 系统用户(下游用户)id
 * @param uSign {String} 系统用户(下游用户)的 用户唯一标识
 * @param libId {Number}  库 id
 * @param libName {String} 库名称
 * @return {Promise}
 */
const updateLibName = async(uid, uSign, libId, libName)=> {
    try {
        const sql = "update library set l_name=?,last_at=now() where l_u_id=? and l_u_uname = ? and l_id = ?";
        const params = [libName, parseInt(uid), uSign, parseInt(libId)];
        const affectInfo = await mysqlHelper.query("fs", sql, params);
        return affectInfo.affectedRows;
    } catch (e) {
        return e;
    }
};

/**
 * 删除所有 通过 libId数组
 * @param uid {Number} 系统用户(下游用户)id
 * @param uSign {String} 系统用户(下游用户)的 用户唯一标识
 * @param libArr {Array}  库 id 数组
 */
const deleteAllByLibIds = async(uid, uSign, libArr)=> {
    try {
        //获取文件路径数组
        const urlArr = await _getFileUrlsByLibIds(uid, uSign, libArr);
        //删除file和lib表
        //const isDeleteOk = await 
    }catch (e){
        return e;
    }
};

/**
 * 获取所有 在libArr库下面的文件路径
 * @param uid {Number} 系统用户(下游用户)id
 * @param uSign {String} 系统用户(下游用户)的 用户唯一标识
 * @param libArr {Array}  库 id 数组
 */
const _getFileUrlsByLibIds = async(uid, uSign, libArr)=> {
    try {
        let querySql = "select f_url as url from file where f_u_id=? and f_u_uname=? and f_u_ulib IN(";
        let queryParams = [uid, uSign];
        libArr.forEach(function (libId) {
            querySql += libId + ',';
            queryParams.push(libId);
        });
        querySql = querySql.slice(0, -1);
        querySql += ")";
        const urls = await mysqlHelper.query('fs', querySql, queryParams);
        let urlArr = [];
        urls.forEach(function (ele) {
            urlArr.push(ele.url);
        });
        return urlArr;
    } catch (e) {
        return e;
    }
};




module.exports = {
    checkHasLibIdOrNot: checkHasLibIdOrNot,
    checkHasFileNameOrNot: checkHasFileNameOrNot,
    checkHasLibNameOrNot: checkHasLibNameOrNot,
    saveFileSingle: saveFileSingle,
    getLibInnerList: getLibInnerList,
    getLibInnerFiles: getLibInnerFiles,
    getLibInnerLibs: getLibInnerLibs,
    getLibIdArrByPid: getLibIdArrByPid,
    addNewLib: addNewLib,
    updateLibName: updateLibName,
    deleteAllByLibIds: deleteAllByLibIds
};

/**
 * 多目录生成
 * @param basePath  基本路径  不需判断是否生成
 * @param arr  路径数组  [201702,20170224,2017022411]
 * @param cb  callback
 * @return {string} basePath
 * @private
 */
const _createFolders = (basePath, arr, cb) => {
    try {
        if (!arr.length) return cb(null, basePath);
        basePath = path.normalize(basePath + '/' + arr.shift());
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath);
        }
        _createFolders(basePath, arr, cb);
    } catch (e) {
        cb(e, null);
    }
};

/**
 * promisify _createFolders
 */
const _createFoldersP = promisify(_createFolders);

/**
 * 生成文件目录数组
 * @return {*[]}
 * @private
 */
const _createTimeArr = ()=> {
    var now = new Date();
    var fileRealName = baseFn.toMD5(now.Format('yyyyMMddhhmmss') + baseFn.random());
    return [now.Format('yyyyMM'), now.Format('yyyyMMdd'), now.Format('yyyyMMddhh'), fileRealName];
};


//测试
// console.log("__dirname : " + __dirname);

// _createFolders(__dirname, [111, 888, 444, 333, 66, 111],function (err, res) {
//     console.log(err,res)
// });

// var a = _createFoldersP(__dirname, [111, 888, 55, 333, 444, 111]);
// console.log("a　:　" + JSON.stringify(a));

// (async ()=> {
//     var a =  await _createFoldersP(__dirname, [2, 33, 55, 333, 444, 111]);
//     console.log("a　:　" + a);
// })();


