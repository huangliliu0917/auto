const commons = require('./common.js');

/**
 * 通过酷安或者豌豆荚的连接下载
 * 1：浏览器下载
 * 2：小米app商城下载
 */
//趣头条
// download("http://api.1sapp.com/app/download",1);
// DL("http://api.1sapp.com/app/download", 2);
//中青看点
// download("https://res.youth.cn/youth_v1.2.8_code20_180824_c3001.apk",1);
//惠头条
// download("https://www.wandoujia.com/apps/com.cashtoutiao/download/dot?ch=detail_normal_dl",1);

//下载app
var download = {};

download.DL = function (name, url, type) {
    toastLog('开始下载...');
    if (type == 1) {
        download.wdjDL(name);
    }
    //打开浏览器下载
    if (type == 2) {
        download.browseDL(url);
    }
}

download.browseDL = function (url) {
    app.openUrl(url);
    //立即下载
    // waitForActivity('mark.via.ui.activity.BrowserActivity');
    waitForActivity('com.android.internal.app.ResolverActivity');
    var browse = text('夸克').findOnce();
    if (browse) {
        sleep(1000);
        browse.click();
    }
    waitForActivity('com.ucpro.BrowserActivity');
    var confirm = text('确定').findOne()
    if (confirm) {
        confirm.click();
        sleep(1000);
    } else {
        toastLog('打开浏览器失败');
        return;
    }
    // 检查30分钟是否安装成功
    var retry = 0;
    while (retry < 1800) {
        install();
        retry++;
    }

}

download.wdjDL = function (name) {
    var appName = '豌豆荚';
    // var package = 'com.wandoujia.phoenix2';
    commons.wakeUp();
    commons.launch(appName);
    waitForActivity('com.pp.assistant.activity.PPMainActivity');
    var search = id('a9b').findOnce();
    if (search) {
        search.click();
        sleep(1000 * random(1, 2));
        setText(name);
        id('ahs').waitFor();
    } else {
        toastLog('找不搜索框');
        return;
    }
    var eles = id('ahs').findOnce()
    if (!eles) {
        toastLog('找不到应用');
        return;
    }
    var isBreak = false;
    for (i = 0; i < eles.childCount(); i++) {
        if (isBreak) {
            toastLog('跳过');
            break;
        }
        var ele = eles.child(i);
        var title = ele.findOne(id('dz'));
        if (!title) {
            toastLog('跳过');
            continue;
        }
        if (title.text() == name) {
            var dl = ele.findOne(id('g3'));
            toastLog('开始下载 (' + name + ' )...')
            dl.click();
            sleep(30 * 1000);
            var activity = currentActivity();
            toastLog(activity);
            if (activity == 'com.android.packageinstaller.PackageInstallerActivity') {
                toastLog('正在安装');
                install();
                text('完成').waitFor();
                click('完成');
                sleep(1000);
                back();
                break;
            }
            // 检查30分钟是否安装成功
            var retry = 0;
            while (retry < 1800) {
                var progress = id("g3").findOnce();
                toastLog(progress);
                if (!progress) {
                    toastLog('下载成功');
                    install();
                    text('完成').waitFor();
                    click('完成');
                    sleep(1000);
                    back();
                    break;
                }
                retry++;
                sleep(1000);
            }
        }
    }

}

download.install = function () {
    text('安装').waitFor();
    var isInstall = text("安装").findOnce();
    if (isInstall) {
        sleep(3000);
        isInstall.click();
    }
}

module.exports = download;