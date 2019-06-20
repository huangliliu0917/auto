const commons = require('common.js');

        // toastLog('签到')
        // sleep(350 * random(1, 2));
        // var sign = id('tv_today_sign').findOnce();
        // var signText = sign.text();
        // if (signText.includes('明日')) {
        //     toastLog('已签到');
        //     sleep(1000* random(1, 2));
        // }
        // if (sign) {
        //     sign.click()
        // }
        // sleep(1000 * random(1, 2));
        // click('立即签到');
        textContains('获得').waitFor();
        var close = textContains('获得').findOnce();
        if (close) {
            close.parent().child(0).click();
            sleep(1000);
        }