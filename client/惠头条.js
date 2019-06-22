const commons = require('common.js');

"auto";
var appName = '惠头条';
var indexBtnText = "头条"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新"; //首页特有的标志文字，重要！
var totalNewsOneTime = 20; 
var totalNewsReaded = 0;
var readTitleArray = [];
var retry = 0;

function main() {
    // readNews();
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    signIn();
    toastLog('开始刷新');
    // awardReport();
    jumpToIndex();
    sleep(1000 * random(1, 2));
    while (totalNewsReaded < totalNewsOneTime && retry < 20) {
        sleep(1000 * random(1, 2));
        toastLog('获取时段奖励');
        getTimeAward();
        checkClose();
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
            commons.checkActivity('com.cashtoutiao.account.ui.main.MainTabActivity');
        }
        sleep(350 * random(1, 2));
        jumpToIndex();
    }

    function getTimeAward() {
        var timeAward = text('点击领取').findOnce();
        if (timeAward) {
            toastLog('获取时段奖励');
            timeAward.parent().parent().click();
            sleep(350 * random(1, 2))
            var close = id('tv_left').findOne();
            if (close) {
                close.click();
            }
        }
    }

    function readNews() {
        var eles = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!eles) {
            return;
        }
        for (var i = 0; i < eles.childCount(); i++) {
            sleep(150 * random(1, 2));
            checkClose();
            var ele = eles.child(i);
            if (!ele) continue;
            var y = ele.findOne(id('tv_src'));
            if (!y || y.length == 0) {
                toastLog('跳过');
                continue;
            }
            var accountName = y.text()
            if (accountName.includes('广告') || accountName.includes('红包抽奖')) {
                toastLog('跳过广告');
                continue;
            }

            var title = id('tv_title').findOnce();
            if (title) {
                if (readTitleArray.indexOf(title.text()) == -1) {
                    readTitleArray.push(title.text())
                } else {
                    toastLog('已看过');
                    continue;
                }
            }

            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('展开全文', 12);
            checkClose();
            back();
            sleep(300);
        }
        // exit();
    }

}

main()