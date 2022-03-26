cordova.define("cordova-plugin-hello.hello", function(require, exports, module) {
var exec = require('cordova/exec');

exports.showConsole = function (arg0, success, error) {
    exec(success, error, 'hello', 'actionShow', [arg0]);
};

exports.startActivity = function(success, error) {
    exec(success, error, 'hello', 'startActivity', []);	
};

});
