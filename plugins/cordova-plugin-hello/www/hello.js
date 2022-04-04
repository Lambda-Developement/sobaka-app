var exec = require('cordova/exec');

exports.showConsole = function (arg0, success, error) {
    exec(success, error, 'hello', 'actionShow', [arg0]);
};

exports.startActivity = function(success, error,argument) {
    exec(success, error, 'hello', 'startActivity', [argument]);
};
