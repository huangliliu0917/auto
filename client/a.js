// var clean = text('CLEAR ALL').findOnce()
// clean.click();
// toastLog(clean);


function cleanAllApp() {
    recents();
    sleep(1000);
    var isClean = false;
    while (!clean) {
        toastLog('寻找clear all')
        scrollDown();
        sleep(1000);
        scrollDown();
        var clean = text('部清除').findOnce();
        if (clean) {
            clean.click();
            isClean = true;
            sleep(1000);
        }
    }
}

cleanAllApp();
// recents();