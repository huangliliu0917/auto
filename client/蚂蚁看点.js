const commons = require('common.js');

"auto";
var appName = '蚂蚁看点';
var indexBtnText = "看点"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新";//首页特有的标志文字，重要！
var totalNewsOneTime = 9;
var totalNewsReaded = 0;
var retry = 0;

var closeIds = ['imgClose', 'iv_close'];

var w = device.width,
    h = device.height;

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    awardReport();
    checkClose();
    // signIn();
    while (totalNewsReaded < totalNewsOneTime && retry < 3) {
        toastLog(222);
        jumpToIndex();
        toastLog('开始刷新');
        sleep(1000 * random(1, 2));
        checkClose();
        // 红包
        sleep(200);
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
        retry++;
    }

    function checkClose() {
        if (id("xj").exists()) {
            id("xf").findOne().click();
        }
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
        jumpToIndex();
    }

    function signIn() {
        className("android.widget.RelativeLayout").clickable(true).depth(6).findOne().click()
        sleep(3000 * random(1, 2));
        // 关闭广告
        var ad = id('ivClose').findOnce();
        if (ad) {
            ad.click();
        }

        // 签到
        toastLog('签到')
        sleep(350 * random(1, 2));
        var needSign = id('tv_today_sign').findOnce();
        var needSigntext = needSign.text();
        if (needSigntext.includes('明日')) {
            toastLog('已签到');
            sleep(1000* random(1, 2));
            jumpToIndex();
            return;
        }
        var sign = id('tv_sign').findOnce();
        if (sign) {
            sign.click()
        }
        sleep(1000 * random(1, 2));
        click('立即签到');
        sleep(1000 * random(1, 2));
        // 返回
        var signBack = text('close').findOnce();
        if (signBack) {
            signBack.click();
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
            for (var j = 0; j < 12; j++) {
                sleep(1024);
                swipe(w / 2, h * 0.6, w / 2, h * 0.3, 800);
                sleep(500);
                var more = text('open').findOnce();
                if (more) {
                    more.parent().click();
                }
            }
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