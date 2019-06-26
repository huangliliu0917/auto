const commons = require('common.js');

"auto";
var appName = '微鲤看看';
var indexBtnText = "头条"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "头条"; //首页特有的标志文字，重要！
var totalNewsOneTime = 30;
var totalNewsReaded = 0;
var retry = 0;

function main() {
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    checkClose();
    toastLog('签到');
    // signIn();
    while (totalNewsReaded < totalNewsOneTime && retry < 10) {
        jumpToIndex();
        toastLog('开始刷新');
        sleep(1000 * random(1, 2));
        checkClose();
        readNews();
        sleep(300);
        // scrollDown(1);
        commons.scrollUpByHuman();
        sleep(500);
        readNews();
        retry++;
    }
    signIn();

    function checkClose() {
        var close = id('imgClose').findOnce();
        if (close) {
            toastLog('关闭提示');
            close.click();
            return;
        }
        var close = id('iv_close').findOnce();
        if (close) {
            toastLog('关闭提示');
            close.click();
            return;
        }
    }

    function signIn() {
        var sign = id('rl_head_line').findOnce();
        if (sign && sign.findOne(text('签到'))) {
            sign.click();
            sleep(3 * 1000)
            sign = text('立即签到').findOnce();
            sign.click();
            sleep(1000);
            commons.checkActivity('cn.etouch.ecalendar.MainActivity');
        } else {
            toastLog('已签到')
            return;
        }
    }


    function jumpToIndex() {
        var home = id('rl_bottom_1').findOnce();
        home.click();
    }

    function readNews() {
        var list = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!list) {
            toastLog('未找到文章');
            return;
        }
        for (var i = 3; i < list.childCount(); i++) {
            sleep(150 * random(1, 2));
            var ele = list.child(i);
            if (!ele) continue;
            if (ele.childCount() < 1) continue;
            if (ele.child(0).childCount() != 2) {
                toastLog('跳过');
                continue;
            }
            var accountName = ele.find(id('tv_chat_room_tag'))
            if (!accountName) {
                toastLog('跳过广告或置顶');
                continue;
            }
            var t = ele.child(0).child(1);
            if (!t.clickable()) {
                toastLog('跳过');
                continue;
            }
            t.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('展开查看全文', 16);
            back();
            sleep(300);
        }
    }

}

main()