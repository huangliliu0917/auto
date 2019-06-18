const commons = require('common.js');

"auto";
var appName = '惠视频';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "首页";//首页特有的标志文字，重要！
var totalNewsOneTime = 9;
var totalNewsReaded = 0;
var retry = 0;

var w = device.width,
    h = device.height;

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    signIn();
    sleep(1000 * random(1, 2));
    while (totalNewsReaded < totalNewsOneTime && retry < 3) {
        toastLog('开始刷新');
        jumpToIndex();
        sleep(1000 * random(1, 2));
        toastLog('获取时段奖励');
        getTimeAward();
        sleep(1000 * random(1, 2));
        readNews();
        scrollDown(1);
        readNews();
        retry++;
    }

    function checkClose() {
        var isClose = id('img_close').findOnce()
        if (isClose) {
            isClose.click();
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

    function signIn() {
        click('任务中心');
        sleep(1000 * random(1, 2));
        var sign = id('sign_btn_container').findOnce();
        if (sign) {
            sign.click();
            sleep(1000 * random(1, 2))
            // var isWait = id('content').findOne();
            var isWait = text('领取中...').findOnce();
            if (isWait) {
                toastLog('等待');
                back();
                sleep(350 * random(1, 2))
            }
            var back = id('tv_back').findOnce();
            if (back) {
                back.click()
                sleep(350 * random(1, 2))
            }
            var back = id('iv_back').findOnce();
            if (back) {
                back.click()
                sleep(350 * random(1, 2))
            }
            var close = id('btn_no').findOnce();
            if (close) {
                close.click()
                sleep(350 * random(1, 2))
            }
            var close = id('tv_left').findOnce();
            if (close) {
                close.click()
                sleep(350 * random(1, 2))
            }
        }
        sleep(350 * random(1, 2));
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
            return;
        }
        for (var i = 2; i < eles.childCount(); i++) {
            sleep(150 * random(1, 2));
            var ele = eles.child(i);
            var t = ele.findOne(id('nick_name'));
            if (!t) continue;
            var accountName = t.text()
            var ad = accountName.includes('广告');
            if (ad) {
                toastLog('跳过广告')
                continue;
            }
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            for (var j = 0; j < 12; j++) {
                sleep(1500);
                swipe(w / 2, h * 0.6, w / 2, h * 0.3, 800);
                sleep(1000);
            }
            getAward();
            back();
            sleep(300);
        }
    }

}

function getAward() {
    var award = id('iv_video_time_bg').findOnce();
    if (award) {
        sleep(350 * random(1, 2));
        award.parent().parent().click();
        sleep(350 * random(1, 2));
        var back = id('navigation_button').findOnce();
        if (back) {
            back.click();
            sleep(350 * random(1, 2));
        }
        toastLog('领取奖励')
    }
}

main()