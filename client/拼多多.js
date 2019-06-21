const commons = require('common.js');

"auto";
var appName = '拼多多';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "刷新";//首页特有的标志文字，重要！
var totalNewsOneTime = 17;
var totalNewsReaded = 0;

var w = device.width,
    h = device.height;

function main() {
    // commons.wakeUp();
    // commons.launch(appName);
    // sleep(1000 * random(1, 2));
    signIn();
    // cat();
    // browse();
    

    
    function cat() {
        text('cat_bubble_v2').waitFor();
        var cat = text('可摸猫').findOnce();
        if (cat) {
            cat.parent().parent().click();
            // id('l_').waitFor();
            sleep(5 * 1000);
            click(920, 2000);
            sleep(5 * 1000);
            var award = text('收下礼物').findOne();
            award.click();
            sleep(1000)
            click(200, 2000);
            sleep(3000);
            browse();
            back();
        }
    }

    function browse() {
        var isRead = textContains('当前页面浏览').findOnce();
        if (isRead) {
            var read = true
            while (read) {
                scrollDown(1);
                sleep(950 * random(1, 3));
                scrollDown(1);
                sleep(750 * random(1, 3));
                scrollUp(1);
                sleep(650 * random(1, 3));
                var leftTimeText= textContains('领取').findOnce();
                if (!leftTimeText) {
                    toastLog('已结束');
                    break;
                }
                if (!leftTimeText || !leftTimeText.text()) {
                    toastLog('已结束');
                    break;
                }
                var leftTime = parseInt(leftTimeText.text().replace(/[^0-9]*/g,""));
                toastLog(leftTime);
                if (leftTime > 0) {
                    read = true
                }
            }
        }
        back();
    }

    function checkClose() {
        var back = id('km').findOnce();
        if (back) {
            toastLog('返回');
            back.parent().click();
            sleep(1000);
        }
        var back = textStartsWith('不赚钱').findOnce();
        if (back) {
            back.click();
            sleep(1000);
        }
    }

    function signin() {
        var sign = text('签到领现金').findOnce();
        toastLog(sign);
        if (sign) {
            toastLog(111);
            commons.centerClick(sign);
            sleep(1000);
        }
    }


    function signIn() {
        var ele = text('现金签到').findOnce();
        if (!ele) {
            toastLog('签到失败');
            return;
        }
        ele.parent().click();
        waitForActivity('com.xunmeng.pinduoduo.activity.NewPageActivity');
        sleep(3000)
        signin();
        cat();
        back();
        back();
    }

    function getAward() {
        var eles = className('android.view.View').depth(15).find()[126]
        for (i=0;i<eles.childCount();i++) {
            ele = eles.child(i);
            toastLog(i);
            // if (i==0) {
            //     getTimeAward(ele);
            // }
        }
    }

    function getTimeAward(ele) {
        ele.click();
    }

}

main()