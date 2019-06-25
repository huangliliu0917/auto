const commons = require('common.js');

toastLog(111);
        var award = text('点击领取').findOnce();
        if (award) {
            award.click();
            sleep(3000);
            back();
        }