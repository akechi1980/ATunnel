"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var zlib = require("zlib");
var TunnelUtils = (function () {
    function TunnelUtils() {
    }
    TunnelUtils.encode = function (inbuf, method, pass) {
        try {
            if (method == 'aes-128-cbc')
                return this.aes_128_cbc_encrypt(inbuf, pass);
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
            if (method == 'aes-128-cbc')
                return this.aes_128_cbc_decrypt(inbuf, pass);
            var decipher = crypto.createDecipher(method, pass);
            var result = decipher.update(inbuf);
            result = Buffer.concat([result, decipher.final()]);
        }
        catch (e) {
            console.log(e.message);
        }
        return result;
    };
    TunnelUtils.aes_128_cbc_encrypt = function (data, key) {
        var IV = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
        var encipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'utf8'), IV);
        var crypted = encipher.update(data);
        crypted = Buffer.concat([crypted, encipher.final()]);
        return crypted;
    };
    TunnelUtils.aes_128_cbc_decrypt = function (crypted, key) {
        var IV = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
        var decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'utf8'), IV);
        var decoded = decipher.update(crypted);
        decoded = Buffer.concat([decoded, decipher.final()]);
        return decoded;
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
var testBuf = Buffer.from('JustTest');
console.log(testBuf);
console.log(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]));
console.log(TunnelUtils.aes_128_cbc_encrypt(testBuf, '1234567890123456'));
//# sourceMappingURL=Utils.js.map