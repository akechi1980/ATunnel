/**
 *   TunnelUtils 
 */
import * as crypto from 'crypto';
import * as zlib from 'zlib';

export class TunnelUtils{

    //............encode............
    public static encode(inbuf: Buffer,method: any,pass : String) {
        try{
            if(method == 'aes-128-cbc') return this.aes_128_cbc_encrypt(inbuf, pass);


            var cipher = crypto.createCipher(method, pass);
            var result = cipher.update(inbuf);
            // encrypted = cipher.final();
            result = Buffer.concat([result, cipher.final()]);
        }catch(e){
            console.log(e.message);
        }
    
        return result;
    }

    //............unzip............
    public static decode(inbuf: Buffer,method: any,pass : String) {
        try{

            if(method == 'aes-128-cbc') return this.aes_128_cbc_decrypt(inbuf, pass);

            var decipher = crypto.createDecipher(method, pass);
            var result = decipher.update(inbuf);
            result = Buffer.concat([result, decipher.final()]);
        }catch(e){
            console.log(e.message);
        }
        return result;
    }


    //............encode............
    /**
    * aes 128 cbc加密 PKCS5Padding填充
    * @param data 原始数据
    * @param key 密钥 设备AccessCode前16个字符
    * @returns 密文Buffer
    */
    public static aes_128_cbc_encrypt(data, key){
        var IV = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 
            0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
        var encipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'utf8'), IV);
        var crypted = encipher.update(data);
        crypted = Buffer.concat([crypted, encipher.final()]);
        return crypted;
    }

    /**
    * aes 128 cbc解密，返回解密后的字符串
    * @param crypted 密文
    * @param key 密钥 设备AccessCode前16个字符
    * @returns 明文
    */
    public static aes_128_cbc_decrypt(crypted, key){
        var IV = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 
            0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
        var decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'utf8'), IV);
        var decoded = decipher.update(crypted);
        decoded = Buffer.concat([decoded, decipher.final()]);
        return decoded;
    }


    //............zip............
    public static zip(inbuf:Buffer) {
        try{
            var encrypted = zlib.gzipSync(inbuf);
        }catch(e){
            console.log(e.message);
        }
    
        return encrypted;
    }

    //............unzip............
    public static unzip(inbuf:Buffer) {
        try{
            var result = zlib.gunzipSync(inbuf);       
        }catch(e){
            console.log(e.message);
        }
        return result;
    }

    //............unzip............
    public static CreateHash(inbuf:Buffer) {
        try{
            var hasher = crypto.createHash('sha256');
            hasher.update(inbuf);
            var result = hasher.digest('hex');
        }catch(e){
            console.log(e.message);
        }
        return result;
    }

    public static Rnd(start, end){
        return Math.floor(Math.random() * (end - start) + start);
    }
}


// //TESTCode
var testBuf : Buffer = Buffer.from('JustTest');
console.log(testBuf);
console.log(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 
    0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]));
console.log(TunnelUtils.aes_128_cbc_encrypt(testBuf,'1234567890123456'));

//console.log(TunnelUtils.unzip(TunnelUtils.zip(testBuf)).toString());
