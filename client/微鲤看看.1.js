const commons = require('common.js');
const templates = require('template.js');


templates.init({
    appName: "微鲤看看",
    indexFlagText: "发布",
    timeAwardText: "签到",
    totalNewsOneTime: 20,
    totalNewsReaded: 0,
    retry: 0,
    tipIds: ['imgClose', 'iv_close'],
    activity: 'cn.etouch.ecalendar.MainActivity'
});

templates.run({
    jumpToIndex: function () {
        var home = id('rl_bottom_1').findOnce();
        home.click();
        sleep(1000 * random(2, 3));
        return;
    },
    readNews: function () {
        while (initParam.totalNewsReaded < initParam.totalNewsOneTime && initParam.retry < 10) {
            templates.closeTips();
            toastLog('开始刷新');
            this.jumpToIndex();
            this.getNews();
            commons.scrollDownByHuman();
            this.getNews();
            commons.scrollDownByHuman();
            this.getNews();
            initParam.retry++;
        };
        signIn();

        function signIn() {
            var sign = id('rl_head_line').findOnce();
            if (sign && sign.findOne(text(initParam.timeAwardText))) {
                sign.click();
                sleep(3 * 1000)
                sign = text('立即签到').findOnce();
                sign.click();
                sleep(1000);
                commons.checkActivity(initParam.activity);
            } else {
                toastLog('已签到');
                sleep(1000);
                return;
            }
        }
    },
    getNews: function () {
        var list = className("android.support.v7.widget.RecyclerView").findOnce();
        if (!list) {
            toastLog('未找到文章');
            sleep(1000);
            return;
        }
        for (var i = 3; i < list.childCount(); i++) {
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
            // var hasRead = templates.checkReadTitle(ele, 'yy');
            // if (hasRead) {
            //     toastLog('已阅读');
            //     continue;
            // }
            templates.closeTips();
            t.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            commons.swapeToRead('展开查看全文', 12);
            templates.closeTips();
            back();
            sleep(350 * random(1, 3));
        }
        sleep(1000);
    }
});