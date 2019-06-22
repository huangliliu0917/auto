const commons = require('common.js');


"auto";
var appName = '趣头条';
var indexBtnText = "头条"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新"; //首页特有的标志文字，重要！
var totalNewsOneTime = 30;
var totalNewsReaded = 0;

var closeIds = ['wt', 'fv', 'fw', 'a2m', 'ic'];

var w = device.width,
    h = device.height;

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose()
    toastLog('签到');
    signIn();
    sleep(350 * random(1, 2));
    while (totalNewsReaded < totalNewsOneTime) {
        checkClose();
        toastLog('开始刷新');
        jumpToIndex();
        sleep(200);
        getTimeAward();
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
    }
    // 最后上报
    awardReport();

    function jumpToIndex() {
        var index = id('js').findOnce();
        index.click();
    }

    function signIn() {
        var task = id('jw').findOnce();
        task.click();
        sleep(1000 * random(1, 2));
        var isClose = id('aeg').findOnce();
        if (isClose) {
            isClose.click();
            sleep(350 * random(1, 2))
        }
        jumpToIndex();
    }

    function awardReport() {
        var user = id('jx').findOnce();
        if (user) {
            user.click();
            sleep(3 * 1000);
        } else {
            toastLog('未找到个人中心');
            return;
        }
        checkClose();
        toastLog('今日阅读数据');
        var todayAward = 0;
        var award = 0;
        var todayAwardStr = textContains('今日金币').findOnce()
        if (todayAwardStr) {
            todayAward = parseInt(todayAwardStr.text().replace(/[^0-9]*/g, ""));
        }
        var awardStr = id('aat').findOnce()
        if (awardStr) {
            awardStr = awardStr.text();
            awardStr = awardStr.slice(1, awardStr.length - 1)
            award = parseFloat(awardStr) * 10000;
            award = award.toFixed(0);
        }
        toastLog(todayAward);
        toastLog(award);
        commons.report(todayAward, award)
        sleep(1000);
        jumpToIndex();
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
        var closeText = '去赞赏';
        var close = text(closeText).findOnce();
        if (close) {
            click(closeText);
            sleep(350);
        }
        commons.checkActivity('com.jifen.qkbase.main.MainActivity');
    }

    function is(parent) {
        if (parent.childCount() == 0) {
            if (parent.text() == "\u5e7f\u544a" || (parent.text() == "\u7f6e\u9876" || parent.text() == "\u89c6\u9891")) return true;
            return false;
        }
        for (var i = 0; i < parent.childCount(); i++) {
            if (is(parent.child(i))) return true;
        }
        return false;
    }

    function readNews() {
        sleep(1000 * random(1, 2));
        var list = className("android.support.v7.widget.RecyclerView").findOne();
        var is_ent = false;
        for (var i = 1; i < list.childCount() && !is_ent; i++) {
            checkClose();
            sleep(150 * random(1, 2));
            if (is(list.child(i))) continue;
            is_ent = true;
            list.child(i).click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            for (var j = 0; j < 10; j++) {
                sleep(2000 * random(1, 1.5));
                swipe(w / 2, h * 0.6 + h * random() * 0.1, w / 2, h * 0.3, 600 + 600 * random());
                sleep(2000 * random(1, 1.5));
                var isCheck = text('向右滑动滑块填充拼图').findOnce();
                if (isCheck) {
                    toastLog('滑动验证码检测');
                    exit();
                }
            }
            checkClose();
            back();
            sleep(100);
        }
    }

    function getTimeAward() {
        var timeAward = id('xf').findOnce();
        if (timeAward) {
            toastLog('获取时段奖励');
            timeAward.click();
            sleep(1000 * random(1, 2))
            checkClose();
            sleep(350 * random(1, 2));
            checkClose();
            var isClose = text('我知道了').findOnce();
            if (isClose) {
                toastLog('关闭提示');
                isClose.click();
            }
        }
    }

}

main()