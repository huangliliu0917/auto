const commons = require('common.js');
var string = commons.genRandomString(8, false, false);
toastLog(string);

var t = text('发现新版本').findOnce();
toastLog(t);