/**
 *   TunnelUtils 
 */
import * as crypto from 'crypto';
import * as zlib from 'zlib';

export class TunnelUtils{

    //............encode............
    public static encode(inbuf: Buffer,method: any,pass : String) {
        try{
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
            var decipher = crypto.createDecipher(method, pass);
            var result = decipher.update(inbuf);
            result = Buffer.concat([result, decipher.final()]);
        }catch(e){
            console.log(e.message);
        }
        return result;
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
// var testBuf : Buffer = Buffer.from('JustTest');
// console.log(TunnelUtils.decode(TunnelUtils.encode(testBuf,'aes192', '123'),'aes192', '123').toString());
// console.log(TunnelUtils.unzip(TunnelUtils.zip(testBuf)).toString());
