const commons = require('common.js');

"auto";
var appName = '波波视频';
var totalNewsOneTime = 20;
var totalNewsReaded = 0;
var retry = 0;
var closeTexts = [];
var closeIds = ['aeo', 'a7y', 'b08'];
var activity = 'com.kg.v1.MainActivity';

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    // signIn();
    // sleep(1000 * random(1, 2));
    while (totalNewsReaded < totalNewsOneTime && retry < 3) {
        toastLog('开始刷新');
        checkClose();
        jumpToIndex();
        getTimeAward();
        checkClose();
        sleep(1000 * random(1, 2));
        toastLog('获取时段奖励');
        sleep(1000 * random(1, 2));
        readNews();
        scrollDown(1);
        readNews();
        retry++;
    }
    getAward();

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
        commons.checkActivity(activity);
    }

    function jumpToIndex() {
        var index = id('ak7').findOnce();
        index.click();
    }

    function signIn() {
        var sign = id('a8t').findOnce();
        sleep(1000 * random(1, 2));
        var sign = id('sign_btn_container').findOnce();
        if (sign) {
            sign.click();
            sleep(1000 * random(1, 2))
            checkClose();
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

    function getTimeAward() {
        var timeAward = id('a8t').text('免费领').findOnce();
        if (timeAward) {
            timeAward.parent().click();
            sleep(350 * random(1, 2))
            back();
        }
    }

    function getAward() {
        var user = id('akf').findOnce();
        if (user) {
            toastLog('获取奖励');
            user.click();
            sleep(1000 * random(1, 2))
            var award = id('a91').findOnce();
            if (award) {
                award.click();
                sleep(1000 * random(1, 2))
                text('一键领取').waitFor();
                award = text('一键领取').findOnce();
                award.click();
                sleep(350 * random(1, 3));
                back();
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
        for (var i = 0; i < eles.childCount(); i++) {
            sleep(150 * random(1, 2));
            var ele = eles.child(i);
            if (!ele) continue 
            var isAd = ele.findOne(text('广告'));
            if (isAd) continue;
            if (ele.child(0).childCount() < 1) continue;
            ele.child(0).click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            sleep(1000 * random(3, 5));
            commons.centerClick(ele);
            sleep(100 * random(1, 3))
            var t = id('att').findOnce();
            if (t) {
                t.click();
                sleep(60 * 1000 * random(1, 5))
                back();
            }
            checkClose()
            scrollDown(1);
        }
    }

}

main()