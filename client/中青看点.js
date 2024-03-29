const commons = require('common.js');

"auto";
var appName = '中青看点';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新"; //首页特有的标志文字，重要！
var totalNewsOneTime = 30; 
var totalNewsReaded = 0;
var retry = 0;

var closeIds = ['imgClose', 'iv_close', 'ivClose'];

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    signIn();
    while (totalNewsReaded < totalNewsOneTime && retry < 10) {
        jumpToIndex();
        toastLog('开始刷新');
        sleep(1000 * random(1, 2));
        checkClose();
        sleep(200);
        readNews();
        sleep(300);
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
        sleep(1000);
        // commons.checkActivity('com.weishang.wxrd.activity.MainActivity')
    }

    function signIn() {
        className("android.widget.RelativeLayout").clickable(true).depth(6).findOne().click()
        sleep(3000 * random(1, 2));
        checkClose();

        awardReport();
        sleep(1000);

        // 签到
        toastLog('签到')
        sleep(350 * random(1, 2));
        var needSign = id('tv_today_sign').findOnce();
        var needSigntext = needSign.text();
        if (needSigntext.includes('明日')) {
            toastLog('已签到');
            sleep(1000 * random(1, 2));
            jumpToIndex();
            return;
        }
        var sign = id('tv_sign').findOnce();
        if (sign) {
            sign.click()
        }
        sleep(1000 * random(3, 5));
        click('立即签到');
        sleep(1000 * random(1, 2));
        // 返回
        commons.checkActivity('com.weishang.wxrd.activity.MainActivity');
        checkClose();
        jumpToIndex();

    }

    function awardReport() {
        toastLog('今日阅读数据');
        var todayAward = 0;
        var award = 0;
        var todayAwardStr = id('tv_today_douzi').findOnce()
        if (todayAwardStr) {
            todayAward = parseInt(todayAwardStr.text());
        }
        var awardStr = id('tv_douzi').findOnce()
        if (awardStr) {
            award = parseInt(awardStr.contentDescription)
        }
        toastLog(todayAward);
        toastLog(award);
        commons.report(todayAward, award)
    }

    function jumpToIndex() {
        var home = id('tv_home_tab').findOnce();
        home.click();
    }

    function readNews() {
        sleep(1000 * random(1, 2));
        var list = className("android.widget.ListView").findOne();
        for (var i = 2; i < list.childCount(); i++) {
            sleep(150 * random(1, 2));
            checkClose();
            if (is(list.child(i))) continue;
            list.child(i).click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('查看全文，奖励更多', 16);
            checkClose();
            back();
            sleep(300);
        }
    }

    function is(parent) {
        if (parent.childCount() == 0) {
            if (parent.text() == "\u5e7f\u544a" || parent.text() == "\u7f6e\u9876" || parent.text() == "\u5e7f\u544a\u0020\u2022\u0020\u4e86\u89e3\u8be6\u60c5") return true;
            return false;
        }
        for (var i = 0; i < parent.childCount(); i++) {
            if (is(parent.child(i))) return true;
        }
        return false;
    }

}

main()