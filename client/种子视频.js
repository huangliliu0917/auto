const commons = require('common.js');

"auto";
var appName = '种子视频';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "首页";//首页特有的标志文字，重要！
var totalNewsOneTime = 30;
var totalNewsReaded = 0;
var retry = 0;
var closeTexts = [];
var closeIds = ['aeo'];
var readTitleArray = [];


function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    // signIn();
    while (totalNewsReaded < totalNewsOneTime && retry < 3) {
        toastLog('开始刷新');
        jumpToIndex();
        sleep(1000 * random(1, 2));
        toastLog('获取时段奖励');
        checkClose();
        sleep(1000 * random(1, 2));
        readNews();
        scrollDown(1);
        readNews();
        retry++;
    }

    function checkClose() {
        for (i = 0; i < closeIds.length; i++) {
            var closeId = closeIds[i]
            var isClose = id(closeId).findOnce()
            if (isClose) {
                toastLog('关闭提示');
                sleep(1000);
                isClose.click();
                break;
            }
        }
        for (i = 0; i < closeTexts.length; i++) {
            var closeText = closeTexts[i];
            var isClose = text(closeText).findOnce()
            if (isClose) {
                toastLog('关闭提示');
                sleep(1000);
                isClose.click();
                break;
            }
        }
    }

    function jumpToIndex() {
        var index = id('lf').findOnce();
        index.click();
    }

    function signIn() {
        var task = id('li').findOnce();
        if (!task) {
            toastLog('找不到任务');
            return;
        }
        task.click();
        sleep(1000 * 3)

        jumpToIndex();
    }

    function getTimeAward() {
        var timeAward = id('ll_receive').findOnce();
        if (timeAward) {
            toastLog('获取时段奖励');
            timeAward.click();
            sleep(350 * random(1, 2))
            var close = id('btn_no').findOnce();
            if (close) {
                close.click();
                sleep(350 * random(1, 2))
            }
        }
    }


    function readNews() {
        sleep(1000 * random(1, 2));
        var eles = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!eles) {
            toastLog('未找到视频');
            return;
        }
        toastLog(eles.childCount());
        for (var i = 0; i < eles.childCount(); i++) {
            sleep(650 * random(1, 2));
            var ele = eles.child(i);
            if (!ele) continue 
            var isAd = ele.findOne(text('广告'));
            if (isAd) continue;
            var title = ele.findOne(id('ir'));
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
            commons.swapeToRead('', 36);
            checkClose();
            back();
            scrollDown(1);
        }
        // exit();
    }

}

main()