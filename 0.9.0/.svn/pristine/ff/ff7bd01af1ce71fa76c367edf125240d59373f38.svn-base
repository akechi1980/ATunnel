"use strict";
exports.__esModule = true;
var net = require("net");
var Config_1 = require("./utils/Config");
var CustomPackage_1 = require("./Framesets/CustomPackage");
var RemoteServer = (function () {
    function RemoteServer() {
        Config_1.SettingConfig.isDebug = false;
        Config_1.SettingConfig.init("SettingConfig.json");
        this.RemoteServer = net.createServer({ allowHalfOpen: true });
        this.RemoteServer.on('connection', this.ServerOnConnection);
        this.RemoteServer.on('error', this.ServerOnError);
    }
    RemoteServer.prototype.ServerStart = function () {
        console.log('>> RemoteServer Start... %s %s', Config_1.SettingConfig.RemoteServer_ListenHost, Config_1.SettingConfig.RemoteServer_ListenPort);
        this.RemoteServer.listen(Config_1.SettingConfig.RemoteServer_ListenPort, Config_1.SettingConfig.RemoteServer_ListenHost);
    };
    RemoteServer.prototype.ServerStop = function () {
        this.RemoteServer.end();
    };
    RemoteServer.prototype.ServerOnConnection = function (conn) {
        conn.setKeepAlive(true);
        conn.setNoDelay(true);
        var mCustomPackage = new CustomPackage_1.CustomPackage();
        var mSocket = new net.Socket({ allowHalfOpen: true });
        mSocket.setKeepAlive(true);
        mSocket.setNoDelay(true);
        mSocket.connect(Config_1.SettingConfig.TargetServerPort, Config_1.SettingConfig.TargetServerHost, function () {
            console.log('>> RemoteServer CONNECTED TO TargetServer');
        });
        conn.on('data', function (data) {
            console.log('>> RemoteServer receive data,length:' + data.length);
            mCustomPackage.put(data);
        });
        mSocket.on('data', function (data) {
            var tmp = mCustomPackage.formatData(data);
            conn.write(tmp);
            console.log('>> RemoteServer send data,length:' + data.length);
        });
        mCustomPackage.onRealDataReceivedHandler = function (data) {
            console.log('>> RemoteServer receive package data,length:' + data.length);
            mSocket.write(data);
        };
        mCustomPackage.onErrorHandler = function (err) {
            console.log('RemoteServer mCustomPackage Error %s', err);
            mSocket.end();
            conn.end();
        };
        mSocket.on('error', function (err) {
            console.log('RemoteServer mSocket error %s', err.message);
            mSocket.end();
            conn.end();
        });
        mSocket.on('end', function () {
            console.log('RemoteServer mSocket end');
            mSocket.end();
            conn.end();
        });
        conn.on('end', function () {
            console.log('RemoteServer conn end ');
            mSocket.end();
            conn.end();
        });
        conn.on('error', function (err) {
            console.log('RemoteServer conn error %s', err.message);
            mSocket.end();
            conn.end();
        });
    };
    RemoteServer.prototype.ServerOnError = function (err) {
        console.log('RemoteServer Error %s', err.message);
    };
    return RemoteServer;
}());
exports.RemoteServer = RemoteServer;
var mRemoteServer = new RemoteServer();
mRemoteServer.ServerStart();
//# sourceMappingURL=RemoteServer.js.map