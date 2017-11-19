"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var TestCrypter = (function () {
    function TestCrypter() {
    }
    TestCrypter.aes_128_ecb_encrypt = function (data, key) {
        var encipher = crypto.createCipher('aes-128-ecb', Buffer.from(key, 'utf8'));
        var crypted = encipher.update(data, 'utf8', 'binary');
        crypted += encipher.final('binary');
        return Buffer.from(crypted, 'binary');
    };
    TestCrypter.aes_128_ecb_decrypt = function (crypted, key) {
        var buf = new Buffer(crypted, 'hex');
        var decipher = crypto.createDecipher('aes-128-ecb', Buffer.from(key, 'utf8'));
        var decoded = decipher.update(buf, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    };
    TestCrypter.IV = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    return TestCrypter;
}());
exports.TestCrypter = TestCrypter;
var testBuf = Buffer.from('JustTest');
console.log('JustTest');
console.log(testBuf);
console.log('aes-128-cbc');
console.log(TestCrypter.aes_128_ecb_encrypt(testBuf, '1234567890123456'));
console.log(TestCrypter.aes_128_ecb_decrypt(TestCrypter.aes_128_ecb_encrypt(testBuf, '1234567890123456'), '1234567890123456'));
//# sourceMappingURL=TestCrypter.js.map