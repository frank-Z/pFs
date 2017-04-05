const fs = require('fs');
const path = require('path');

const addMapping = (router, mapping)=> {
    for (let _url in mapping) {
        console.log(_url);
        if (_url.startsWith('GET ')) {
            let _path = _url.substring(4);
            router.get(_path, mapping[_url]);
        }
        else if (_url.startsWith('POST ')) {
            let _path = _url.substring(5);
            router.post(_path, mapping[_url]);
        }
        else {
            console.log(`invalid URL: ${_url}`);
        }
    }
};

// function addControllers(router, dir) {
//     var files = fs.readdirSync(__dirname + dir);
//     var js_files = files.filter((f)=> {
//         return f.endsWith('.js');
//     });
//     for (var f of js_files) {
//         let mapping = require(__dirname + dir + f);
//         addMapping(router, mapping);
//     }
// }


const addControllers = (router, dir)=> {
    let files = traversal([], __dirname + dir);
    let js_files = files.filter((f)=> {
        return f.endsWith('.js');
    });
    for (var f of js_files) {
        let mapping = require(f);
        addMapping(router, mapping);
    }
};

module.exports = function (dir) {
    let controllers_dir = dir || '/app/actions';
    let router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};


const traversal = (arr, dir) => {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            traversal(arr, pathname);
        } else {
            arr.push(pathname);
        }
    });
    return arr;
};