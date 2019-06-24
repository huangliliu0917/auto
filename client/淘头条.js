const commons = require('common.js');

"auto";
var appName = '淘头条';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新"; //首页特有的标志文字，重要！
var totalNewsOneTime = 20;
var totalNewsReaded = 0;
var homeActivity = 'com.sohu.quicknews.homeModel.activity.HomeActivity'

var closeIds = ['btn_close', 'btn_double_reward_toast_start']

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    while (totalNewsReaded < totalNewsOneTime) {
        checkClose();
        jumpToIndex();
        toastLog('开始刷新');
        getTimeAward();
        sleep(200);
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
    }
    checkClose();
    toastLog('签到');
    signIn();

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
        var close = id('btn_sure').findOnce();
        if (close) {
            back();
        }
        sleep(1000);
        // commons.checkActivity(homeActivity);
    }

    function getTimeAward() {
        var timeAward = text('领取').findOnce();
        if (timeAward) {
            timeAward.parent().click();
            sleep(3000);
            sleep(350 * random(1, 3));
            checkClose();
        }
    }

    function signIn() {
        var index = text('头条').findOnce();
        var bar = index.parent().parent();
        var task = bar.child(2);
        if (task) {
            task.click();
            sleep(3 * 1000)
            var sign = id('btn_sign').text('立即签到').findOnce();
            if (sign) {
                sign.click();
                sleep(3 * 1000)
            }
            checkClose();
            sleep(1000);
            jumpToIndex();
        } else {
            toastLog('已签到');
        }
    }

    function jumpToIndex() {
        var index = text('头条').findOnce();
        var bar = index.parent().parent();
        var index = bar.child(0);
        index.click();
    }

    function readNews() {
        sleep(1000 * random(1, 2));
        var eles = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!eles) {
            toastLog('未找到文章');
            return;
        }
        for (var i = 0; i < eles.childCount(); i++) {
            sleep(150 * random(1, 2));
            checkClose();
            var ele = eles.child(i);
            if (!ele) continue;
            if (!ele.clickable()) {
                toastLog('跳过');
                continue;
            }
            var accountName = ele.findOne(id('tv_topnews_timeandsource'));
            // toastLog(accountName);
            if (!accountName) {
                toastLog('跳过广告');
                continue;
            }
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('展开阅读全文', 12);
            checkClose();
            back();
            sleep(300);
        }
    }

}

main()