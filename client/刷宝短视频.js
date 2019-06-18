const commons = require('common.js');

var appName = '刷宝短视频';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
// var indexFlagText = "刷新";//首页特有的标志文字，重要！
var totalNewsReaded = 1; //已经阅读的新闻条数
// var totalNewsOneTime = 27; //一次性阅读多少条新闻
var totalNewsOneTime = 50; //一次性阅读多少条新闻
var readTime = 13;
var lastTodayAward = 0;

function main() {
    // app.launch("com.jm.video");
    toastLog('启动');
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
    signIn();
    toastLog('开始浏览');
    yun();

    function yun() {
        while (totalNewsReaded < totalNewsOneTime) {
            checkClose();
            sb();
            totalNewsReaded++;
            if (totalNewsReaded >= totalNewsOneTime) {
                exit();
            }
            if (totalNewsReaded % 9 == 0) {
                checkTodayAward();
            }
        }

        function sb() {
            toastLog('已浏览( ' + totalNewsReaded + ' )个视频');
            swipe(540, 1600, 540, 200, 700);
            sleep(get(readTime));
            if (random(0, 2) > 1) {
                // 点赞
                toastLog('点赞,关注');
                var like = id('praise').findOnce();
                if (like) {
                    like.click();
                    sleep(1000);
                }
                sleep(350 * random(1, 2));
                // 关注
                if (random(0, 3) < 1) {
                    var follow = text('关注').findOnce()
                    if (follow) {
                        follow.click();
                        sleep(1000);
                    }
                }
            }
        }
    }

    function get(num) {
        return num * random(0.96 * 1000, 1.27 * 1000)
    }

    function signIn() {
        click('任务');
        sleep(1000 * random(1, 2));
        checkClose();
        signin();
        sleep(1000 * random(1, 2));
        checkAward();
        timeAward();
        toastLog('返回首页');
        checkClose();
        click('首页');
        sleep(1000);
    }

    function checkTodayAward() {
        click('任务');
        sleep(1000 * random(1, 2));
        checkClose();
        sleep(1000 * random(1, 2));
        checkAward();
        toastLog('返回首页');
        checkClose();
        click('首页');
        sleep(1000);

    }


    function checkAward() {
        var ele = className("android.widget.Image").text("gold").findOne().parent();
        var award = ele.child(5);
        todayAward = parseInt(award.text().replace(',', ''));
        if (lastTodayAward != 0 && lastTodayAward >= todayAward - 9) {
            var totalAward = parseFloat(ele.child(1).child(1).text());
            commons.report(todayAward, totalAward * 10000);
            toastLog('今天金币已领完');
            exit();
        }
        lastTodayAward = todayAward
        toastLog('挣了(' + todayAward/10000 + ')元');
        sleep(1000 * random(1, 2));
    }

    function signin() {
        var sign = text('立即签到').findOnce();
        if (sign) {
            toastLog('签到');
            sign.click();
            sleep(350 * random(1, 2));
            var ele = text('元宝').findOnce();
            if (ele) {
                ele.parent().child(0).click();
            }
        }
    }

    function timeAward() {
        var red = text('开箱领元宝').findOnce();
        if (red) {
            toastLog('领元宝');
            red.parent().click();
            sleep(350 * random(1, 2));
        }
    }

    function checkClose() {
        var close = id('imgClose').findOnce();
        if (close) {
            toastLog('关闭提示');
            close.click();
        }
    }
}


main()