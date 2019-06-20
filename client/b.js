const commons = require('common.js');

var signTexts = ['立即签到', '签到', '求好运']
                    for (var x = 0; x < signTexts.length; x++) {
                        var signText = signTexts[x]
                        var sign = text(signText).findOnce();
                        toastLog(sign);
                        if (sign) {
                            sign.click();
                            if (sign.clickable()) {
                                sign.click();
                            } else {
                                sign.parent().click();
                            }
                            sleep(3 * 1000);
                        }
                    }
                    // var sign = text('签到').findOnce();
                    // toastLog(sign);