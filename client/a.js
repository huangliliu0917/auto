const commons = require('common.js');



// commons.cleanAllApp();
var url = 'https://res.youth.cn/youth_v1.2.8_code20_180824_c3001.apk'
commons.DL('趣头条', url, 2)
// recents();
function getClickItem(ele) {
    var clickAble = ele.clickable();
    var item = ele;
    while (!clickAble) {
        item = item.parent();
        clickAble = item.clickable();
        sleep(1000);
    }
    return item;
}

// var ele = textContains('Via').findOnce();
// var item = getClickItem(ele);
// toastLog(item);
// item.click();
