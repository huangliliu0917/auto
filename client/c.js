const commons = require('common.js');
var string = commons.genRandomString(8, false, false);
toastLog(string);

        var sign = text('签到领现金').findOnce();
        toastLog(sign);
        if (sign) {
            toastLog(111);
            // toastLog(sign.parent());
            click('签到领现金');
            sleep(1000);
        }