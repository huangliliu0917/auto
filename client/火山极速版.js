const commons = require('common.js');

"auto";
var appName = '火山极速版';

var closeIds = ['p1'];

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    signIn();

    function checkClose() {
        var close = text('javascript:;').findOnce();
        if (close) {
            toastLog('关闭提示');
            sleep(1000);
            close.click();
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

    function signIn() {
        var tabs = text('红包').findOnce(0);
        checkClose();
        if (tabs) {
            tabs.parent().click();
            sleep(1000 * random(1, 3));
            var gold = text('开宝箱得金币').findOnce();
            if (gold) {
                checkClose();
                gold.parent().click();
                sleep(1000 * random(1, 3));
                var share = textContains('分享给朋友再得').findOnce();
                var shareCount = 0;
                while (share && shareCount < 3) {
                    share.parent().click();
                    sleep(300 * random(1, 3));
                    var shareText = '去粘贴';
                    text(shareText).waitFor();
                    click(shareText);
                    sleep(700 * random(1, 3));
                    back();
                    sleep(300 * random(1, 3))
                    shareCount ++;
                }
                var close = text('javascript:;').findOnce();
                if (close) {
                    close.click();
                }
            }
        }
        checkClose();
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

}

main()