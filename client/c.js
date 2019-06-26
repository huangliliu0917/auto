const commons = require('common.js');
// var string = commons.genRandomString(8, false, false);
// toastLog(string);

var storage = storages.create("duration");
var t = storage.get('搜狐资讯');
toastLog(t);


function checkStorage() {
    toastLog('检查storage');
    sleep(1000);
    var date = new Date().Format("yyyy-MM-dd");
    var name = '日期';
    var storage = storages.create("version");
    var lastDate = storage.get(name);
    toastLog(lastDate);
    sleep(1000);
    if (lastDate == undefined || lastDate != date) {
        // 新一天重置storage数据
        toastLog('清理storage,lastDay是 ' + lastDate);
        var keys = ['version', 'task', 'duration'];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            storages.remove(key);
        }
        var storage = storages.create("version");
        storage.put(name, date);
        sleep(1000);

    }
}


// checkStorage();

// storages.remove('version');

// var date = new Date().Format("yyyy-MM-dd");
// var date = '2019-06-25';
// var name = '日期';
// var storage = storages.create("version");
// storage.put(name, date);
// var lastDate = storage.get(name);
// toastLog(lastDate);
