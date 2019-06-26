const commons = require('common.js');

"auto";
var appName = '蚂蚁看点';
var indexBtnText = "看点"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新";//首页特有的标志文字，重要！
var totalNewsOneTime = 30;
var totalNewsReaded = 0;
var retry = 0;

var closeIds = ['imgClose', 'iv_close', 'ivClose'];

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    signIn();
    while (totalNewsReaded < totalNewsOneTime && retry < 10) {
        checkClose();
        toastLog('开始刷新');
        jumpToIndex();
        sleep(1000 * random(1, 2));
        toastLog('领取时段奖励')
        getTimeAward();
        sleep(200);
        readNews();
        sleep(300);
        // scrollDown(1);
        commons.scrollUpByHuman();
        sleep(500);
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
    }

    function getTimeAward() {
        var timeAward = text('领取').findOnce();
        if (timeAward) {
            timeAward.parent().click();
            sleep(3000);
            back();
            checkClose();
        }
    }

    function awardReport() {
        checkClose();
        var user = id('tv_user_tab').findOnce();
        if (user) {
            user.click();
            sleep(3 * 1000);
        }
        toastLog('今日阅读数据');
        var todayAward = 0;
        var award = 0;
        var todayAwardStr = id('user_coin').findOnce()
        if (todayAwardStr) {
            todayAward = parseInt(todayAwardStr.text());
        }
        var awardStr = id('user_today_coin').findOnce()
        if (awardStr) {
            award = parseInt(awardStr.contentDescription)
        }
        toastLog(todayAward);
        toastLog(award);
        commons.report(todayAward, award)
        sleep(1000);
    }

    function signIn() {
        var user = id('tv_user_tab').findOnce();
        if (!user) {
            toastLog('找不到我的');
            return;
        }
        user.click();
        id('iv_activity').findOne(5 * 1000)
        // 关闭广告
        sleep(1000 * random(1, 2));
        checkClose();
        awardReport();

        // 签到
        toastLog('签到')
        sleep(350 * random(1, 2));
        var sign = id('tv_today_sign').findOnce();
        var signText = sign.text();
        if (signText.includes('更多金币')) {
            toastLog('已签到');
            sleep(1000* random(1, 2));
            jumpToIndex();
            return;
        }
        if (sign) {
            sign.click()
        }
        sleep(1000 * random(1, 2));
        if (!text('立即签到').findOnce) {
            toastLog('已签到');
            jumpToIndex();
            return;
        }
        sleep(1000 * random(1, 2));
        var sign = text('立即签到').findOnce();
        if (!sign) {
            toastLog('找不到签到');
            return;
        }
        sign.click();
        // 返回
        textContains('获得').waitFor();
        var close = textContains('获得').findOnce();
        if (close) {
            close.parent().child(0).click();
            sleep(1000);
        }
        sleep(1000 * random(1, 2));
        var back = id('iv_back').findOnce()
        // toastLog(back);
        if (back) {
            back.click();
            sleep(1000 * random(1, 2));
            back.click();
        }
        sleep(350 * random(1, 2));
        jumpToIndex();

    }

    function jumpToIndex() {
        var home = id('tv_home_tab').findOnce();
        home.click();
    }

    function readNews() {
        var list = className("android.widget.ListView").findOnce();
        if (!list) {
            toastLog('找不到文章');
            return;
        }
        for (var i = 1; i < list.childCount(); i++) {
            sleep(150 * random(1, 2));
            checkClose();
            var ele = list.child(i);
            if (ele.childCount() != 3) {
                toastLog('跳过');
                continue;
            }
            var accountName = ele.child(2).child(0);
            if (!accountName || accountName.text().includes('广告')) {
                toastLog('跳过广告');
                continue;
            }
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('open', 16);
            checkClose();
            back();
            sleep(300);
        }
    }
}

main()