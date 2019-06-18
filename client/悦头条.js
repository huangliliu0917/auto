const common = require('common.js');

"auto";
var appName = '悦头条';
var indexBtnText = "首页"; //其他页面挑到首页的按钮文字，重要！
var indexFlagText = "头条";//首页特有的标志文字，重要！
var totalNewsOneTime = 9;
var totalNewsReaded = 0;

var w = device.width,
    h = device.height;

function main() {
    common.wakeUp();
    common.launch(appName);
    sleep(1000 * random(1, 2));
    while (totalNewsReaded < totalNewsOneTime) {
        click(indexFlagText);
        toastLog('开始刷新');
        sleep(1000 * random(1, 2));
        sleep(200);
        readNews();
        sleep(300);
        scrollDown(1);
        sleep(500);
        readNews();
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
            var t = ele.findOne(id('txt_second_advName'));
            if (!t) {
                toastLog('跳过广告')
                continue;
            }
            ele.click();
            totalNewsReaded++;
            toastLog('已浏览( ' + totalNewsReaded + ' )篇文章');
            for (var j = 0; j < 12; j++) {
                sleep(1024);
                swipe(w / 2, h * 0.6, w / 2, h * 0.3, 800);
                sleep(500);
                var more = text('点击阅读全文').findOnce();
                if (more) {
                    more.parent().click();
                }
            }
            back();
            sleep(300);
        }
    }

}

main()