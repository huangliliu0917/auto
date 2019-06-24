const common = require('common.js');
var template = {};

/*
 * 初始化参数
 */

var initParam = {
    appName: "", //应用名称
    totalNewsReaded: 0, //已经阅读的新闻条数
    totalNewsOneTime: 30, //一次性阅读多少条新闻
    indexBtnText: "首页", //其他页面挑到首页的按钮文字，重要！
    indexFlagText: "刷新", //首页特有的标志文字，重要！
    timeAwardText: "领取", //时段奖励关键字
    tipIds: [], // 关闭提示id
    tipTexts: [], // 关闭提示语
    readTitleArray: [], // 已看过文章标题
    retry: 10, // 重试次数
    activity: '', // 当前活动
}

template.init = function (param) {
    Object.assign(initParam, param);
}

/*
 * 主要流程flow
 */
template.run = function (fun) {
    toastLog("启动 ===> " + initParam.appName)
    common.wakeUp();
    common.launch(initParam.appName);
    sleep(1000 * random(1, 2))
    template.closeTips()

    /*
     * 自动更新
     */
    // toastLog("自动更新 ===> " + initParam.appName)
    // template.autoUpdate(fun);
    // template.closeTips()

    toastLog("回到首页 ===> " + initParam.appName)
    if (fun.jumpToIndex != null) {
        fun.jumpToIndex();
        template.closeTips()
    }

    toastLog("签到 ===> " + initParam.appName)
    if (fun.signIn != null) {
        fun.signIn();
        template.closeTips()
    }

    /*
     * 阅读流程
     */
    toastLog("阅读 ===> " + initParam.appName)
    if (fun.readNews != null) {
        fun.readNews();
        template.closeTips()
    }
}

template.autoUpdate = function (fun) {
    var updateFlag = false;
    var updateBtn;
    if (text("安全升级").findOnce()) {
        updateFlag = true;
        updateBtn = text("安全升级").findOnce();
    }
    if (text("立即升级").findOnce()) {
        updateFlag = true;
        updateBtn = text("立即升级").findOnce();
    }
    if (text("立即更新").findOnce()) {
        updateFlag = true;
        updateBtn = text("立即更新").findOnce();
    }
    if (text("升级").findOnce()) {
        updateFlag = true;
        updateBtn = text("升级").findOnce();
    }

    if (updateFlag) {
        updateBtn.click();
    } else {
        return;
    }

    //循环找安装，有可能安装还不能用
    var installFlag = false;
    while (!installFlag) {
        sleep(1000);
        var uiele = text("安装").findOnce();
        toast("开始找安装");
        if (uiele) {
            uiele.click();
            sleep(1000);
            uiele = text("安装").findOnce();
            if (!uiele) {
                installFlag = true;
            }
        }
    }
    //安装完成
    var installFinishFlag = false;
    while (!installFinishFlag) {
        sleep(1000);
        var uiele = text("完成").findOnce();
        if (uiele) {
            uiele.click();
            installFinishFlag = true;
        }
    }

    //重新运行
    template.run(fun);
}

template.closeTips = function () {
    var tipIds = initParam.tipIds;
    if (tipIds.length > 0) {
        for (i = 0; i < tipIds.length; i++) {
            var tipId = tipIds[i]
            var tip = id(tipId).findOnce()
            if (tip) {
                toastLog('关闭提示');
                sleep(1000);
                tip.click();
                break;
            }
        }

    }
    var tipTexts = initParam.tipTexts;
    if (tipTexts.length > 0) {
        for (i = 0; i < tipTexts.length; i++) {
            var tipText = tipTexts[i];
            var tip = text(tipText).findOnce()
            if (tip) {
                toastLog('关闭提示');
                sleep(1000);
                tip.click();
                break;
            }
        }
    }
}

template.checkReadTitle = function (ele, name) {
    var hasRead = true;
    var title = ele.findOne(id(name));
    if (title) {
        var titleText = title.text();
        toastLog(titleText);
        if (initParam.readTitleArray.indexOf(titleText) == -1) {
            initParam.readTitleArray.push(titleText);
            hasRead = false;
        }
    }
    return hasRead;
}

module.exports = template;