const commons = require('common.js');

"auto";
var appName = '全民头条';
var totalNewsOneTime = 20;
var totalNewsReaded = 0;
var retry = 0;
var readTitleArray = [];

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    signIn();
    while (totalNewsReaded < totalNewsOneTime && retry < 3) {
        checkClose();
        toastLog('开始刷新');
        jumpToIndex();
        sleep(1000 * random(1, 2));
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
        retry++;
    }

    function checkClose() {
        var close = id('tv_gold_number').findOnce();
        if (close) {
            back();
            sleep(1000);
        }
    }

    function signIn() {
        var task = text('任务').findOnce();
        var tab = task.parent().parent().parent();
        if (task) {
            tab.child(2).click();
            sleep(3 * 1000);
            var sign = text('签到').findOnce();
            if (sign) {
                sign.click();
                sleep(1000);
                back();
            } else {
                toastLog('已签到');
            }
        } else {
            toastLog('找不到导航');
            jumpToIndex();
            return;
        }
        jumpToIndex();
    }


    function jumpToIndex() {
        var task = text('任务').findOnce();
        var tab = task.parent().parent().parent();
        tab.child(0).click();
        sleep(1000);
    }

    function readNews() {
        var list = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!list) {
            toastLog('未找到文章');
            return;
        }
        for (var i = 3; i < list.childCount(); i++) {
            sleep(650 * random(1, 2));
            var ele = list.child(i);
            if (!ele) continue;
            var accountName = ele.find(id('tv_source'))
            if (!accountName) {
                toastLog('跳过广告或置顶');
                continue;
            }
            var title = ele.findOne(id('tv_news_title'));
            if (title) {
                toastLog(title.text());
                if (readTitleArray.indexOf(title.text()) == -1) {
                    readTitleArray.push(title.text())
                } else {
                    toastLog('已看过');
                    continue;
                }
            } else {
                toastLog('未找到标题');
                continue;
            }
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('展开全文', 12);
            back();
            sleep(300);
        }
    }

}

main()