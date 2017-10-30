"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var zlib = require("zlib");
var TunnelUtils = (function () {
    function TunnelUtils() {
    }
    TunnelUtils.encode = function (inbuf, method, pass) {
        try {
            var cipher = crypto.createCipher(method, pass);
            var result = cipher.update(inbuf);
            result = Buffer.concat([result, cipher.final()]);
        }
        catch (e) {
            console.log(e.message);
        }
        return result;
    };
    TunnelUtils.decode = function (inbuf, method, pass) {
        try {
            var decipher = crypto.createDecipher(method, pass);
            var result = decipher.update(inbuf);
            result = Buffer.concat([result, decipher.final()]);
        }
        catch (e) {
            console.log(e.message);
        }
        return result;
    };
    TunnelUtils.zip = function (inbuf) {
        try {
            var encrypted = zlib.gzipSync(inbuf);
        }
        catch (e) {
            console.log(e.message);
        }
        return encrypted;
    };
    TunnelUtils.unzip = function (inbuf) {
        try {
            var result = zlib.gunzipSync(inbuf);
        }
        catch (e) {
            console.log(e.message);
        }
        return result;
    };
    TunnelUtils.CreateHash = function (inbuf) {
        try {
            var hasher = crypto.createHash('sha256');
            hasher.update(inbuf);
            var result = hasher.digest('hex');
        }
        catch (e) {
            console.log(e.message);
        }
        return result;
    };
    TunnelUtils.Rnd = function (start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    };
    return TunnelUtils;
}());
exports.TunnelUtils = TunnelUtils;
//# sourceMappingURL=Utils.js.map