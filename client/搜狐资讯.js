const commons = require('common.js');

"auto";
var appName = '搜狐资讯';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新"; //首页特有的标志文字，重要！
var totalNewsOneTime = 30;
var totalNewsReaded = 0;
var activity = 'com.sohu.quicknews.homeModel.activity.HomeActivity'
var readTitleArray = [];

var closeIds = ['btn_receive', 'act_close_image']

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    signIn();
    while (totalNewsReaded < totalNewsOneTime) {
        checkClose();
        jumpToIndex();
        toastLog('开始刷新');
        sleep(1000 * random(1, 2));
        // 红包
        sleep(200);
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
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
        commons.checkActivity(activity);
    }

    function signIn() {
        var bar = id('footer_view').findOnce();
        var user = bar.child(3);
        if (user) {
            user.click();
            sleep(1 * 1000)
            var tasks = id('task_entrance_gv').findOnce();
            if (!tasks) {
                toastLog('没有找到任务');
                return;
            }
            var sign = tasks.child(0);
            sign.click();
            sleep(1 * 1000)
            checkClose();
        } else {
            toastLog('已签到')
        }
    }


    function jumpToIndex() {
        var bar = id('footer_view').findOnce();
        var index = bar.child(0);
        index.click();
    }

    function readNews() {
        var eles = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!eles) {
            toastLog('未找到文章');
            return;
        }
        for (var i = 0; i < eles.childCount(); i++) {
            sleep(150 * random(1, 2));
            checkClose();
            var ele = eles.child(i);
            if (!ele) continue;
            var red = ele.findOne(id('energy_open'));
            if (red) {
                toastLog('获取奖励');
                checkClose();
                red.click();
                sleep(1000);
                continue;
            }
            var isAd = ele.findOne(text('广告'));
            if (isAd) {
                toastLog('跳过广告');
                continue;
            }
            var title = ele.findOne(id('article_title'));
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
            if (!ele.clickable()) {
                toastLog('跳过');
                continue;
            }
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('', 12);
            checkClose();
            back();
            sleep(300);
        }
    }

}

main()