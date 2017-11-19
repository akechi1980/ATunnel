import * as crypto from 'crypto';
import * as zlib from 'zlib';

export class TestCrypter{

    static IV = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
                            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    //............encode............
    /**
    * aes 128 cbc加密 PKCS5Padding填充
    * @param data 原始数据
    * @param key 密钥 设备AccessCode前16个字符
    * @returns 密文Buffer
    */
    public static aes_128_ecb_encrypt(data, key){
        var encipher = crypto.createCipher('aes-128-ecb', Buffer.from(key, 'utf8'));
        var crypted = encipher.update(data, 'utf8', 'binary');
        crypted += encipher.final('binary');
        return Buffer.from(crypted, 'binary');
    }

    /**
    * aes 128 cbc解密，返回解密后的字符串
    * @param crypted 密文
    * @param key 密钥 设备AccessCode前16个字符
    * @returns 明文
    */
    public static aes_128_ecb_decrypt(crypted, key){
        var buf = new Buffer(crypted, 'hex');
        var decipher = crypto.createDecipher('aes-128-ecb', Buffer.from(key, 'utf8'));
        var decoded = decipher.update(buf, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }

  
}

var testBuf : Buffer = Buffer.from('JustTest');
console.log('JustTest');
console.log(testBuf);
//console.log(TestCrypter.decode(TestCrypter.encode(testBuf,'seed-ofb', '123456'),'seed-ofb', '123456'));
console.log('aes-128-cbc');
console.log(TestCrypter.aes_128_ecb_encrypt(testBuf,'1234567890123456'));
console.log(TestCrypter.aes_128_ecb_decrypt(TestCrypter.aes_128_ecb_encrypt(testBuf,'1234567890123456'),'1234567890123456'));
// console.log('aes-128-ccm');
// console.log(TestCrypter.encode(testBuf,'aes-128-ccm', '123456','0000000000000000'));
// console.log('aes-128-cfb aes-128-cfb1');
// console.log(TestCrypter.encode(testBuf,'aes-128-cfb', '123456',''));
// console.log('aes-128-cfb8');
// console.log(TestCrypter.encode(testBuf,'aes-128-cfb8', '123456',''));
// console.log('camellia-128-cbc');
// console.log(TestCrypter.encode(testBuf,'camellia-128-cbc', '123456',''));
// console.log('seed-ofb');
// console.log(TestCrypter.encode(testBuf,'seed-ofb', '123456',''));
// console.log('idea');
// console.log(TestCrypter.encode(testBuf,'idea', '123456',''));
// console.log('rc2');
// console.log(TestCrypter.encode(testBuf,'rc2', '123456',''));
// console.log('rc4');
// console.log(TestCrypter.encode(testBuf,'rc4', '123456',''));
// console.log('des3');
// console.log(TestCrypter.encode(testBuf,'des3', '123456',''));
// console.log('blowfish');
// console.log(TestCrypter.encode(testBuf,'blowfish', '123456',''));