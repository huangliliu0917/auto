function report(todayAward, award) {
    var packageName = currentPackage();
    var appName = getAppName(packageName);
    var url = 'http://104.225.144.193:5000/report';
    var res = http.post(url, {
        'sign': 'august',
        'app_name': appName,
        'package_name': packageName,
        'today_award': todayAward,
        'award': award
    });
    toastLog(res.body.string());
}

report(100, 200)