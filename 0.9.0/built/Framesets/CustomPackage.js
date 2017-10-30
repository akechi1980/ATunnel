"use strict";
exports.__esModule = true;
var Utils_1 = require("../utils/Utils");
var Config_1 = require("../utils/Config");
var CustomPackage = (function () {
    function CustomPackage() {
        this.PackageDiffMode = 'PackageDiff';
        this.PackageSizeStarPos = 0;
        this.PackageOffset = 0;
        this.ReadCacheBuffer = new Buffer([]);
        this.PackageHead = this.mkPackageHead();
        this.PackageDataChkHead = this.mkPackageDataChkHead();
    }
    CustomPackage.prototype.mkPackageHead = function () {
        var PackageHead = Buffer.allocUnsafe(Config_1.SettingConfig.PackageHeadLength).fill([0]);
        for (var i = 0; i < Config_1.SettingConfig.PackageHeadFormat.length; i++) {
            if (Config_1.SettingConfig.PackageHeadFormat[i].type == 'String') {
                PackageHead.write(Config_1.SettingConfig.PackageHeadFormat[i].contents, Config_1.SettingConfig.PackageHeadFormat[i].startPos, Config_1.SettingConfig.PackageHeadFormat[i].length);
            }
            else if (Config_1.SettingConfig.PackageHeadFormat[i].type == 'PackageSize') {
                this.PackageDiffMode = 'PackageSize';
                this.PackageSizeStarPos = Config_1.SettingConfig.PackageHeadFormat[i].startPos;
            }
            else if (Config_1.SettingConfig.PackageHeadFormat[i].type == 'PackageSizeLE') {
                this.PackageDiffMode = 'PackageSizeLE';
                this.PackageSizeStarPos = Config_1.SettingConfig.PackageHeadFormat[i].startPos;
            }
            else if (Config_1.SettingConfig.PackageHeadFormat[i].type == 'Num') {
                PackageHead.writeFloatBE(Config_1.SettingConfig.PackageHeadFormat[i].contents, Config_1.SettingConfig.PackageHeadFormat[i].startPos, Config_1.SettingConfig.PackageHeadFormat[i].length);
            }
        }
        return PackageHead;
    };
    CustomPackage.prototype.mkPackageDataChkHead = function () {
        var PackageDataChkHead = Buffer.allocUnsafe(Config_1.SettingConfig.PackageDataChkHeadLength).fill([0]);
        for (var i = 0; i < Config_1.SettingConfig.PackageDataChkHeadFormat.length; i++) {
            if (Config_1.SettingConfig.PackageDataChkHeadFormat[i].type == 'ChkString') {
                PackageDataChkHead.write(Config_1.SettingConfig.PackageDataChkHeadFormat[i].contents, Config_1.SettingConfig.PackageDataChkHeadFormat[i].startPos, Config_1.SettingConfig.PackageDataChkHeadFormat[i].length);
            }
            else if (Config_1.SettingConfig.PackageDataChkHeadFormat[i].type == 'ChkHash') {
                var tmp = Utils_1.TunnelUtils.CreateHash(Config_1.SettingConfig.PackageDataChkHeadFormat[i].contents);
                (new Buffer(tmp.toString(), 'Hex')).copy(PackageDataChkHead, Config_1.SettingConfig.PackageDataChkHeadFormat[i].startPos, 0, (new Buffer(tmp.toString(), 'Hex')).length);
            }
        }
        return PackageDataChkHead;
    };
    CustomPackage.prototype.getNextPackageOffset = function () {
        var posResult = 0;
        if (this.PackageDiffMode == 'PackageSize') {
            posResult = this.ReadCacheBuffer.readUInt32BE(this.PackageSizeStarPos) + this.PackageHead.length;
            if (posResult > this.ReadCacheBuffer.length) {
                posResult = -1;
            }
        }
        else if (this.PackageDiffMode == 'PackageSizeLE') {
            posResult = this.ReadCacheBuffer.readUInt32LE(this.PackageSizeStarPos) + this.PackageHead.length;
            if (posResult > this.ReadCacheBuffer.length) {
                posResult = -1;
            }
        }
        else if (this.PackageDiffMode == 'PackageDiff') {
            posResult = this.ReadCacheBuffer.indexOf(this.PackageHead, 1);
        }
        return posResult;
    };
    CustomPackage.prototype.formatData = function (inRealData) {
        var PackageDataBuffer = Buffer.concat([this.PackageDataChkHead, inRealData]);
        if (Config_1.SettingConfig.PackageDataEncode.type != '') {
            PackageDataBuffer = Utils_1.TunnelUtils.encode(PackageDataBuffer, Config_1.SettingConfig.PackageDataEncode.type, Config_1.SettingConfig.PackageDataEncode.password);
        }
        var len = PackageDataBuffer.length;
        var PackageDataBuffer = Buffer.concat([this.PackageHead, PackageDataBuffer]);
        if (this.PackageDiffMode == 'PackageSize') {
            PackageDataBuffer.writeInt32BE(len, this.PackageSizeStarPos);
        }
        else if (this.PackageDiffMode == 'PackageSizeLE') {
            PackageDataBuffer.writeInt32LE(len, this.PackageSizeStarPos);
        }
        return PackageDataBuffer;
    };
    CustomPackage.prototype.put = function (inBuffer) {
        var pos = 0;
        this.ReadCacheBuffer = Buffer.concat([this.ReadCacheBuffer, inBuffer]);
        do {
            try {
                if (this.ReadCacheBuffer.length < this.PackageHead.length + this.PackageDataChkHead.length)
                    break;
                pos = this.getNextPackageOffset();
                if (pos > 0) {
                    var data = this.ReadCacheBuffer.slice(0, pos);
                    this.ReadCacheBuffer = this.ReadCacheBuffer.slice(pos);
                    data = data.slice(this.PackageHead.length);
                    if (Config_1.SettingConfig.PackageDataEncode.type != '') {
                        data = Utils_1.TunnelUtils.decode(data, Config_1.SettingConfig.PackageDataEncode.type, Config_1.SettingConfig.PackageDataEncode.password);
                    }
                    if (data.indexOf(this.PackageDataChkHead) == 0)
                        data = data.slice(this.PackageDataChkHead.length);
                    else {
                        this.onErrorHandler('PackageDataChkHead Check Error!');
                        break;
                    }
                    this.onRealDataReceivedHandler(data);
                }
                else {
                    break;
                }
            }
            catch (error) {
                this.onErrorHandler('PackageHead Check Error!');
            }
        } while (true);
    };
    return CustomPackage;
}());
exports.CustomPackage = CustomPackage;
//# sourceMappingURL=CustomPackage.js.map