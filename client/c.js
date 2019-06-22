const commons = require('common.js');

    function signIn() {
        var index = text('头条').findOnce();
        var bar = index.parent().parent();
        var task = bar.child(2);
        if (task) {
            task.click();
            sleep(1 * 1000)
            var sign = id('btn_sign').text('立即签到');
            if (sign) {
                sign.click();
                sleep(1 * 1000)
            }
            // commons.checkActivity('cn.etouch.ecalendar.MainActivity');
        } else {
            toastLog('已签到')
        }
    }
    signIn()