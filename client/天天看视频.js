const commons = require('common.js');

var appName = '天天看视频';
var totalNewsReaded = 1; //已经阅读的新闻条数
var totalNewsOneTime = 27; //一次性阅读多少条新闻

function main() {
    // app.launch("com.jm.video");
    toastLog('启动');
    commons.wakeUp();
    commons.launch(appName);
    sleep(1000 * random(1, 2));
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
        }

        function sb() {
            toastLog('已浏览( ' + totalNewsReaded + ' )个视频');
            swipe(540, 1600, 540, 200, 700);
            sleep(15 * 1000);
            if (random(0, 3) < 1) {
                // 点赞
                toastLog('点赞,关注');
                var like = id('layout_recvideo_like').findOnce();
                if (like) {
                    like.click();
                    sleep(1000);
                }
                sleep(350 * random(1, 2));
                // 关注
                if (random(0, 2) < 1) {
                    var share = id('layout_recvideo_share').findOnce();
                    if (share) {
                        share.click();
                        sleep(1000);
                        var eles = id('first_option_layout').findOnce()
                        if (eles) {
                            eles.child(0).click();
                            sleep(1000 * random(1, 3));
                        }
                        back();
                        sleep(1000);
                        var activity = currentActivity();
                        if (activity != 'com.tiantiankan.video.newui.main.MainActivity') {
                            back();
                        }
                    }
                    var follow = id('layout_recvideo_follow').findOnce();
                    if (follow) {
                        follow.click();
                        sleep(1000);
                    }
                }
            }
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