"use strict";
exports.__esModule = true;
var fs = require("fs");
var SettingConfig = (function () {
    function SettingConfig() {
    }
    SettingConfig.init = function (filename) {
        var contents = fs.readFileSync(filename);
        var jsonContent = JSON.parse(contents.toString('UTF8'));
        this.LocalServer_ListenHost = jsonContent.LocalServer_ListenHost;
        this.LocalServer_ListenPort = jsonContent.LocalServer_ListenPort;
        this.RemoteServer_Address = jsonContent.RemoteServer_Address;
        this.RemoteServer_ListenHost = jsonContent.RemoteServer_ListenHost;
        this.RemoteServer_ListenPort = jsonContent.RemoteServer_ListenPort;
        this.TargetServerHost = jsonContent.TargetServerHost;
        this.TargetServerPort = jsonContent.TargetServerPort;
        this.PackageHeadFormat = jsonContent.PackageHeadFormat;
        this.PackageDataChkHeadFormat = jsonContent.PackageDataChkHeadFormat;
        this.PackageDataEncode = jsonContent.PackageDataEncode;
        for (var i = 0; i < jsonContent.PackageHeadFormat.length; i++) {
            if (this.PackageHeadLength < (jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length))
                this.PackageHeadLength = jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length;
        }
        for (var i = 0; i < jsonContent.PackageDataChkHeadFormat.length; i++) {
            if (this.PackageDataChkHeadLength < (jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length))
                this.PackageDataChkHeadLength = jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length;
        }
        if (this.isDebug) {
            console.log("---------------------------------------");
            console.log("LocalServer_ListenHost:", jsonContent.LocalServer_ListenHost);
            console.log("LocalServer_ListenPort:", jsonContent.LocalServer_ListenPort);
            console.log("RemoteServer_Address:", jsonContent.RemoteServer_Address);
            console.log("RemoteServer_ListenHost:", jsonContent.RemoteServer_ListenHost);
            console.log("RemoteServer_ListenPort:", jsonContent.RemoteServer_ListenPort);
            console.log("TargetServerHost:", jsonContent.TargetServerHost);
            console.log("TargetServerPort:", jsonContent.TargetServerPort);
            console.log("---------------------------------------");
            console.log("PackageHeadFormat:", jsonContent.PackageHeadFormat.length);
            for (var i = 0; i < jsonContent.PackageHeadFormat.length; i++) {
                if (this.PackageHeadLength < (jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length))
                    this.PackageHeadLength = jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length;
                console.log("   ---------------------------------------");
                console.log("   startPos:" + jsonContent.PackageHeadFormat[i].startPos);
                console.log("   length:" + jsonContent.PackageHeadFormat[i].length);
                console.log("   type:" + jsonContent.PackageHeadFormat[i].type);
                console.log("   contents:" + jsonContent.PackageHeadFormat[i].contents);
            }
            console.log("PackageHeadLength:" + this.PackageHeadLength);
            console.log("PackageDataChkHeadFormat:", jsonContent.PackageDataChkHeadFormat.length);
            for (var i = 0; i < jsonContent.PackageDataChkHeadFormat.length; i++) {
                if (this.PackageDataChkHeadLength < (jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length))
                    this.PackageDataChkHeadLength = jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length;
                console.log("   ---------------------------------------");
                console.log("   startPos:" + jsonContent.PackageDataChkHeadFormat[i].startPos);
                console.log("   length:" + jsonContent.PackageDataChkHeadFormat[i].length);
                console.log("   type:" + jsonContent.PackageDataChkHeadFormat[i].type);
                console.log("   contents:" + jsonContent.PackageDataChkHeadFormat[i].contents);
            }
            console.log("PackageDataChkHeadLength:" + this.PackageDataChkHeadLength);
            console.log("---------------------------------------");
            console.log("PackageDataEncode.type:", jsonContent.PackageDataEncode.type);
            console.log("PackageDataEncode.password:", jsonContent.PackageDataEncode.password);
        }
    };
    SettingConfig.version = "0.0.2";
    SettingConfig.LocalServer_ListenHost = "0.0.0.0";
    SettingConfig.LocalServer_ListenPort = 2204;
    SettingConfig.RemoteServer_Address = "172.104.113.168";
    SettingConfig.RemoteServer_ListenHost = "0.0.0.0";
    SettingConfig.RemoteServer_ListenPort = 8882;
    SettingConfig.TargetServerHost = "<TargetServerHost>";
    SettingConfig.TargetServerPort = 22;
    SettingConfig.PackageHeadLength = 0;
    SettingConfig.PackageDataChkHeadLength = 0;
    SettingConfig.isDebug = false;
    return SettingConfig;
}());
exports.SettingConfig = SettingConfig;
//# sourceMappingURL=Config.js.map