const common = require('common.js');

"auto";
var appName = 'Q头条';
var indexBtnText = "头条"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新";//首页特有的标志文字，重要！
var totalNewsOneTime = 9;
var totalNewsReaded = 0;
var retry = 0;

var w = device.width,
    h = device.height;

function main() {
    readNews();
    common.wakeUp();
    common.launch(appName);
    sleep(1000 * random(1, 2));
    isFresh = checkInternet();
    if (isFresh) {
        sleep(1000 * random(1, 2));
    }
    toastLog('签到');
    // signIn();
    while (totalNewsReaded < totalNewsOneTime && retry < 3) {
        jumpToIndex();
        toastLog('开始刷新');
        sleep(1000 * random(1, 2));
        sleep(200);
        isFresh = checkInternet();
        if (isFresh) {
            sleep(1000 * random(1, 2));
        }
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
    }

    function jumpToIndex() {
        var index = text("刷新").findOnce()
        if (index) {
            toastLog('返回首页');
            index.parent().parent().click();
            return;

        }
        var index = text("头条").findOnce()
        if (index) {
            toastLog('返回首页');
            index.parent().parent().click();
            return;

        }
    }

    function jumpToIndex() {
        var index = text(indexFlagText).findOnce()
        if (index) {
            toastLog('返回首页');
            click(indexFlagText);
            return;

        }
        var index = text(indexBtnText).findOnce()
        if (index) {
            toastLog('返回首页');
            click(indexBtnText);
            return;

        }
    }

    function readNews() {
        var list = className("android.widget.ListView").depth(22).findOnce();
        if (!list) {
            toastLog('未找到文章');
            return;
        }
        toastLog(111);
        for (var i = 1; i < list.childCount(); i++) {
            sleep(150 * random(1, 2));
            var ele = list.child(i);
            // toastLog(ele.child(0));
            var title = ele.child(0);
            var ad = title.text().includes('广告');
            if (ad) {
                toastLog('跳过广告');
                continue;
            }
            title.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            sleep(1000 * random(1, 2))
            var play = text('Play Video ').findOnce();
            if (play) {
                toastLog('播放');
                play.click();
            }
            for (var j = 0; j < 12; j++) {
                sleep(1024);
                swipe(w / 2, h * 0.6, w / 2, h * 0.3, 800);
                sleep(500);
                var more = text('点击阅读全文').findOnce();
                if (more) {
                    more.parent().click();
                }
            }
            back();
            sleep(300);
        }
    }

    function signIn() {
        var ele = className("android.widget.ImageView").depth(10).findOne().parent().parent()
        if (!ele) {
            toastLog('签到失败');
            exit();
        }
        var preSign = ele.child(0);
        toastLog('签到');
        if (preSign) {
            preSign.click();
            sleep(350 * random(1, 2));
            var isSign = text('已签到').findOnce();
            if (isSign) {
                toastLog('已签到');
                sleep(1000* random(1, 2));
                var close = className("android.widget.ImageView").depth(9).findOne().parent();
                close.click()
                return;
            }
            var sign = className("android.widget.TextView").text("立即签到").findOne().parent();
            sign.click()
            sleep(350 * random(1, 2));
            var close = className("android.widget.ImageView").depth(7).findOne().parent().parent().child(1);
            close.click();
            sleep(350 * random(1, 2));
            var back = className("android.widget.ImageView").depth(9).findOne().parent()
            back.click()
            sleep(350 * random(1, 2));
            var close = className("android.widget.ImageView").depth(9).findOne().parent();
            close.click()
        }
    }

    function checkInternet() {
        var isFresh = text('重试').findOnce();
        if (isFresh) {
            toastLog('重新加载');
            sleep(1000 * random(1, 2));
            isFresh.click();
            return true;
        }
        var isFresh = text('重新加载').findOnce();
        if (isFresh) {
            toastLog('重新加载');
            sleep(1000 * random(1, 2));
            isFresh.click();
            return true;
        }
        return false;
    }

}

main()