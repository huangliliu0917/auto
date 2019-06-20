const commons = require('common.js');

"auto";
var appName = '玩赚星球';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新"; //首页特有的标志文字，重要！
var totalNewsOneTime = 5;
var totalNewsReaded = 0;

var closeIds = ['iv_delete_lottie', 'iv_delete', 'iv_close'];
var signTexts = ['立即签到', '签到', '求好运']

var w = device.width,
    h = device.height;

function main() {
    var registerCount = 0;
    var isTaskEnd = false;
    // commons.wakeUp();
    // commons.launch(appName);
    // sleep(1000 * random(1, 2));
    checkClose();

    jumpToMy();
    checkClose();
    signIn();

    getGold();

    getTask();

    // while (totalNewsReaded < totalNewsOneTime) {
    //     jumpToIndex();
    //     toastLog('开始刷新');
    //     sleep(1000 * random(1, 2));
    //     checkClose();
    //     // 红包
    //     sleep(200);
    //     readNews();
    //     sleep(300);
    //     scrollDown(1);
    //     sleep(500);
    //     readNews();
    // }

    function checkClose() {
        sleep(1 * 1000);
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

    function signIn() {
        var sign = id('cv_sign').findOnce()
        var signed = sign.findOne(text('签到'));
        if (sign && signed) {
            sign.click();
            sleep(3 * 1000);
            checkClose();
        }
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
        var home = id('bottom_tab_layout').findOnce();
        home.child(0).child(1).child(0).click()
        sleep(1 * 1000);
    }

    function jumpToMy() {
        var home = id('bottom_tab_layout').findOnce();
        home.child(0).child(0).child(0).click()
        sleep(1 * 1000);
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
            for (var j = 0; j < 12; j++) {
                sleep(1024);
                swipe(w / 2, h * 0.6, w / 2, h * 0.3, 800);
                sleep(500);
                var more = text('查看全文，奖励更多').findOnce();
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

    function doTask(eles) {
        for (i = 0; i < eles.childCount(); i++) {
            var ele = eles.child(0);
            if (ele.findOne(textContains('全部完成'))) {
                registerCount++;
                continue;
            }
            if (ele && ele.findOne(text('去使用'))) {
                toastLog('hoo');
                var skipCount = 0;
                var skip = ele.findOne(text('解锁屏幕看新闻'));
                if (skip) {
                    ele = eles.child(1);
                }
                ele.click();
                sleep(3 * 1000);
                var jump = text('立即领钱').findOnce();
                if (jump) {
                    jump.click();
                    sleep(1 * 1000);
                    commons.checkOpen();
                    sleep(5 * 1000);
                    for (var x = 0; x < signTexts.length; x++) {
                        var signText = signTexts[x]
                        var sign = text(signText).findOnce();
                        if (!sign) {
                            continue;
                        }
                        if (sign.clickable()) {
                            sign.click();
                            sleep(1 * 1000);
                        } else {
                            if (sign.parent().clickable()) {
                                sign.parent().click();
                                sleep(1 * 1000);
                            } else {
                                sign.parent().parent().click();
                                sleep(1 * 1000);
                            }
                        }
                    }
                    commons.checkActivity('com.planet.light2345.agentweb.WebViewActivity')
                }
                back();
                sleep(3 * 1000);
                continue;
            }
            var op = ele.child(1).child(1).child(2).text();
            toastLog(op);
            if (op == '注册领钱') {
                registerCount++;
            }
            if (op == '打开领钱') {
                ele.click();
                sleep(3 * 1000);
                commons.checkOpen();
                sleep(3 * 1000);
                commons.checkActivity('com.planet.light2345.agentweb.WebViewActivity')
                sleep(1000);
            }
            toastLog(op);
            toastLog(222);
            if (op == '安装领钱') {
                toastLog(111);
                ele.click();
                sleep(3 * 1000);
                var activity = currentActivity();
                toastLog(111);
                if (activity == 'com.android.packageinstaller.PackageInstallerActivity') {
                    sleep(3 * 1000);
                    commons.install();
                    id('done_button').waitFor();
                    id('done_button').click();
                    sleep(3 * 1000);
                    commons.checkActivity('com.planet.light2345.agentweb.WebViewActivity')
                    ele.click();
                    sleep(1000);
                }
                commons.checkOpen();
                var retry = 0;
                while (retry < 1800) {
                    var activity = currentActivity();
                    if (activity == 'com.planet.light2345.agentweb.WebViewActivity') {
                        toastLog(activity);
                        sleep(3 * 1000);
                        commons.install();
                        id('done_button').waitFor();
                        id('done_button').click();
                        break;
                    }
                    sleep(1000);
                    retry++;
                }
            }
        }

    }

    function getGold() {
        var gold = text('领金币').findOnce();
        if (gold) {
            gold.parent().click();
            sleep(5 * 1000);
            var eles = className('android.widget.ListView').findOnce();
            while (eles.childCount() > 0 && registerCount != eles.childCount()) {
                toastLog(registerCount)
                toastLog(eles.childCount())
                doTask(eles);
                var refresh = id('ll_common_toolbar_nav_right').findOnce()
                if (refresh) {
                    refresh.click();
                    sleep(3 * 1000);
                }
                var eles = className('android.widget.ListView').findOnce();
                sleep(1000);
            }
            back();
            sleep(1000);
        }
    }

    function getTask() {
        var task = id('title_layout').findOnce();
        toastLog(task);
        if (task) {
            task.click();
            sleep(3 * 1000);
            var eles = className('android.widget.ListView').findOnce(2);
            while (eles.childCount() > 0 && !isTaskEnd) {
                checkTask();
                if (isTaskEnd) {
                    toastLog('已完成task')
                    break;
                }
                doTask(eles);
                var refresh = id('ll_common_toolbar_nav_right').findOnce()
                if (refresh) {
                    refresh.click();
                    sleep(3 * 1000);
                }
                var eles = className('android.widget.ListView').findOnce(2);
                sleep(1000);
            }
            back();
        }
    }

    function checkTask() {
        var progress = textContains('已完成').findOnce()
        if (progress) {
            var finishText = progress.text().split('/')[0]
            var finishCount = parseInt(finishText.replace(/[^0-9]/g,""));
            if (finishCount > 7) {
                isTaskEnd = true
                var eles = className('android.widget.ListView').findOnce(1);
                for (var i=0; i<eles.childCount();i++) {
                    var ele = eles.child(i);
                    ele.click();
                    sleep(1000);
                    var tip = text('我知道了').findOnce();
                    if (tip) {
                        var y = tip.parent();
                        var close = y.child(y.childCount() - 1);
                        close.click();
                        sleep(1000);
                    }
                }

            }
        }
    }


}

main()