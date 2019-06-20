const commons = require('common.js');

"auto";
var appName = '东方头条';
var indexBtnText = "新闻"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新"; //首页特有的标志文字，重要！
var signText = '签到领红包';
var timeAwardText = '领取';

var closeTexts = ['忽略', '忽  略', '继续赚钱'];
var closeIds = ['img_close', 'a_y', 'f7'];
var readTitleArray = [];

var totalNewsOneTime = 12;
var totalNewsReaded = 0;
var retry = 0;
var isFresh = false;


function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));

    back();
    sleep(1000 * random(1, 2));
    checkClose();

    awardReport();

    // signIn();
    sleep(1000 * random(1, 2));
    jumpToIndex();

    while (totalNewsReaded < totalNewsOneTime && retry < 3) {
        // toastLog('获取时段奖励');
        // getTimeAward();
        checkClose();
        toastLog('开始刷新');
        jumpToIndex();
        isFresh = false;
        var scrollRetry = 0;
        // 判断是否找到上次刷新的地方,重试3次
        while (!isFresh && scrollRetry < 3) {
            sleep(350);
            scrollDown(1);
            sleep(350 * random(1, 2));
            readNews();
            scrollRetry++;
        }
        retry++;
    }

    function awardReport() {
        var user = id('jv').findOnce()
        if (user) {
            user.click();
            checkClose();
            sleep(1000);
            checkClose();
            id('agb').waitFor();
            sleep(1000);
            id('agb').click();
            sleep(5 * 1000);
        } else {
            toastLog('找不用户中心');
            return;
        }
        toastLog('今日阅读数据');
        var todayAward = 0;
        var award = 0;
        text('今日金币').waitFor();
        var todayAwardStr = text('今日金币').findOnce()
        if (todayAwardStr) {
            todayAward = parseInt(todayAwardStr.parent().child(4).text().replace(',', ''));
        }
        var awardStr = textContains('当前金币').findOnce()
        if (awardStr) {
            award = parseInt(awardStr.parent().child(1).text().replace(',', ''));
        }
        toastLog(todayAward);
        toastLog(award);
        commons.report(todayAward, award)
        checkClose()
    }

    function signIn() {
        click('去签到');
        sleep(1000 * random(1, 2));

        // var isWait = id('tv_wait_message').findOnce();
        var isWait = id('content').findOnce();
        if (isWait) {
            toastLog('网络阻塞');
            sleep(350 * random(1, 2));
            back();
        }

        var isSign = id("signIn").findOnce();
        if (isSign) {
            isSign.click();
            sleep(1000 * random(1, 2))
            var isClose = className("android.widget.Image").depth(20).findOnce();
            if (isClose) {
                var close = isClose.parent().parent().child(0);
                close.click();
            }
            var isClose = text('签到成功').findOnce();
            if (isClose) {
                var close = isClose.parent().parent();
                close.child(2).click();
                sleep(1000);
                back();
            }
        }
    }

    function checkClose() {
        var isClose = text('立即领取').findOnce();
        if (isClose) {
            back();
            sleep(1000);
            return;
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
        commons.checkActivity('com.songheng.eastfirst.common.view.activity.MainActivity')
    }

    function getTimeAward() {
        var isAward = text(timeAwardText).findOnce();
        if (isAward) {
            click(timeAwardText);
            var close = id('go').findOne();
            close.click()
        }
    }

    function jumpToIndex() {
        var back = id('f7').findOnce();
        while (back) {
            back.click()
            toastLog('返回');
            sleep(350 * random(1, 2))
            var back = id('f7').findOnce();
        }
        var index = id('jn').findOnce();
        if (index) {
            toastLog('返回首页');
            index.click();
            return;

        }
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
        var eles = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!eles) {
            toastLog('未找到文章');
            return;
        }
        toastLog(eles.childCount())
        for (var i = 0; i < eles.childCount(); i++) {
            sleep(150 * random(1, 2));
            checkClose();
            var t = text('刚刚看到这儿').findOnce();
            if (t) {
                toastLog('刚刚看到这儿');
                isFresh = true;
                var fresh = id('g7').findOnce();
                if (fresh) {
                    fresh.click();
                    sleep(1000);
                }
                break;
            }
            var ele = eles.child(i);
            if (!ele) continue;
            var title = ele.findOne(id('oq'));
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
            try {
                var accountName = ele.child(2).child(0).text();
                toastLog(accountName);
            } catch (err) {
                toastLog('获取不到账号名');
                continue;
            }
            if (!accountName || accountName.includes('广告') || accountName.includes('专题') || accountName.includes('置顶')) {
                toastLog('跳过专题或置顶');
                continue;
            }
            // 不可点击
            toastLog(ele.clickable());
            if (!ele.clickable()) continue;
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('点击查看全文', 12);
            checkClose();
            back();
            sleep(1000);
        }
        // exit();
    }
}

main()