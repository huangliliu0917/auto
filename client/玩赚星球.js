const commons = require('common.js');

"auto";
var appName = '玩赚星球';
var totalNewsOneTime = 30;
var totalNewsReaded = 0;

var closeIds = ['iv_delete_lottie', 'iv_delete', 'iv_close', 'll_common_toolbar_back'];
var signTexts = ['立即签到', '签到', '求好运']

function main() {
    var registerCount = 0;
    var isTaskEnd = false;
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();

    jumpToMy();
    checkClose();
    signIn();

    getGold();
    checkClose();
    getTask();

    while (totalNewsReaded < totalNewsOneTime) {
        toastLog('开始刷新');
        jumpToIndex();
        sleep(1000 * random(1, 2));
        checkClose();
        // 红包
        sleep(200);
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
    }

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
        var close = id('box_close_layout').findOnce();
        if (close) {
            toastLog('关闭提示');
            back();
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
        var home = id('tv_main_tab').text('头条').findOnce();
        home.parent().parent().click()
        sleep(1 * 1000);
    }

    function jumpToMy() {
        var home = id('bottom_tab_layout').findOnce();
        home.child(0).child(0).child(0).click()
        sleep(1 * 1000);
    }

    function readNews() {
        sleep(1000 * random(1, 2));
        var list = className('android.view.ViewGroup').findOnce()
        var eles = list.child(1);
        toastLog(eles.childCount());
        if (eles.childCount() < 1) {
            toastLog('未找到文章')
            return;
        }
        for (var i = 0; i < eles.childCount(); i++) {
            sleep(150 * random(1, 2));
            checkClose();
            var ele = eles.child(i);
            if (!ele) continue;
            var isAd = ele.findOne(textContains('广告'));
            if (!ele || isAd) {
                toastLog('跳过广告');
                continue;
            }
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            try {
                commons.swapeToRead('点击阅读全文', 12);
            } catch(err) {
                toastLog('阅读出错');
            }
            checkClose();
            back();
            sleep(300);
        }
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
                // toastLog(ele.findOne(textContains('微鲤看看')));
                var end = ele.findOne(text('使用微鲤看看'));
                if (end) {
                    toastLog('结束循环');
                    break;
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
                        var signClick = commons.getClickItem(sign);
                        signClick.click();
                        if (signText == '求好运') {
                            var items = id('dialog_sign_choose_tag_grid_view').findOne(2000);
                            if (items) {
                                if (random(0, 3) > 1) {
                                    items.child(2).click();
                                } else {
                                    items.child(3).click();

                                }
                            }
                        }
                    }
                    commons.checkActivity('com.planet.light2345.agentweb.WebViewActivity')
                    sleep(1000);
                    if (activity != 'com.planet.light2345.agentweb.WebViewActivity') {
                        recents();
                        var app = descStartsWith(appName).findOne(2000)
                        if (app) {
                            sleep(1000 * random(1, 3));
                            app.click();
                            sleep(1000 * random(2, 3));
                        }
                    }
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
                commons.checkActivity('com.planet.light2345.agentweb.WebViewActivity');
                sleep(1000);
                swithToApp(appName);
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
                    swithToApp(appName);
                    break;
                }
                if (activity != 'com.planet.light2345.agentweb.WebViewActivity') {
                    commons.checkOpen();
                    sleep(1000);
                    swithToApp(appName);
                    break;
                }
                var retry = 0;
                while (retry < 1800) {
                    var activity = currentActivity();
                    if (activity == 'com.android.packageinstaller.PackageInstallerActivity') {
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
        text('领金币').waitFor();
        var gold = text('领金币').findOnce();
        if (gold) {
            gold.parent().click();
            sleep(5 * 1000);
            var eles = className('android.widget.ListView').findOnce();
            if (!eles) {
                toastLog('没有找到任务');
                back();
                return;
            }
            while (eles.childCount() > 0 && registerCount != eles.childCount()) {
                doTask(eles);
                var refresh = id('ll_common_toolbar_nav_right').findOnce()
                if (refresh) {
                    refresh.click();
                    sleep(3 * 1000);
                }
                var eles = className('android.widget.ListView').findOnce();
                if (!eles) {
                    toastLog('没有找到任务');
                    break;
                }
                sleep(1000);
            }
            back();
            sleep(1000);
        }
    }

    function getTask() {
        id('title_layout').waitFor();
        var task = id('title_layout').findOnce();
        if (task) {
            task.click();
            sleep(3 * 1000);
            var eles = className('android.widget.ListView').findOnce(2);
            while (eles.childCount() > 0 && !isTaskEnd) {
                checkTask();
                if (isTaskEnd) {
                    toastLog('已完成task');
                    break;
                }
                doTask(eles);
                var refresh = id('ll_common_toolbar_nav_right').findOnce();
                if (refresh) {
                    refresh.click();
                    sleep(3 * 1000);
                }
                var eles = className('android.widget.ListView').findOnce(2);
                sleep(1000);
            }
            back();
        }
        sleep(1000);
    }

    function checkTask() {
        var progress = textContains('已完成').findOnce()
        if (progress) {
            var finishText = progress.text().split('/')[0]
            var finishCount = parseInt(finishText.replace(/[^0-9]/g, ""));
            if (finishCount > 7) {
                isTaskEnd = true
                var eles = className('android.widget.ListView').findOnce(1);
                for (var i = 0; i < eles.childCount(); i++) {
                    var ele = eles.child(i);
                    if (ele.findOne(text('已领取'))) continue;
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

    function swithToApp(appName) {
        var activity = currentActivity();
        if (activity != 'com.planet.light2345.agentweb.WebViewActivity') {
            recents();
            var app = descStartsWith(appName).findOne(2000)
            if (app) {
                app.click();
                sleep(3 * 1000);
            }
        }
    }


}

main()