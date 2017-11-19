
import * as fs from 'fs';
import {TunnelUtils} from '../utils/Utils';
import {SettingConfig} from '../utils/Config';

export class CustomPackage{
    //CacheBuffer
    ReadCacheBuffer : Buffer;
    
    PackageHead : Buffer;

    PackageDataChkHead : Buffer;

    PackageDiffMode : String = 'PackageDiff';   //PackageSize,PackageSizeLE

    PackageSizeStarPos : number = 0;

    PackageOffset : number = 0;
    public onRealDataReceivedHandler: (data : Buffer) => void;
    
    public onErrorHandler: (error : String) => void;


    constructor() {
        this.ReadCacheBuffer = new Buffer([]);
        // WithDataSize Crypt
        this.PackageHead= this.mkPackageHead();
        this.PackageDataChkHead= this.mkPackageDataChkHead();
    }

    public mkPackageHead(){
        var PackageHead : Buffer = Buffer.allocUnsafe(SettingConfig.PackageHeadLength).fill([0]);

        for (var i = 0;i<SettingConfig.PackageHeadFormat.length;i++){

            if(SettingConfig.PackageHeadFormat[i].type == 'String'){
                PackageHead.write(SettingConfig.PackageHeadFormat[i].contents,
                    SettingConfig.PackageHeadFormat[i].startPos,
                    SettingConfig.PackageHeadFormat[i].length);
            }else if(SettingConfig.PackageHeadFormat[i].type == 'PackageSize'){
                this.PackageDiffMode = 'PackageSize';   
                this.PackageSizeStarPos =  SettingConfig.PackageHeadFormat[i].startPos;
            }else if(SettingConfig.PackageHeadFormat[i].type == 'PackageSizeLE'){
                this.PackageDiffMode = 'PackageSizeLE'; 
                this.PackageSizeStarPos =  SettingConfig.PackageHeadFormat[i].startPos;
            }else if(SettingConfig.PackageHeadFormat[i].type == 'Num'){
                PackageHead.writeFloatBE(SettingConfig.PackageHeadFormat[i].contents,
                    SettingConfig.PackageHeadFormat[i].startPos,
                    SettingConfig.PackageHeadFormat[i].length);
            }

        }

        return PackageHead;
    }

    public mkPackageDataChkHead(){
        var PackageDataChkHead : Buffer = Buffer.allocUnsafe(SettingConfig.PackageDataChkHeadLength).fill([0]);
        for (var i = 0;i<SettingConfig.PackageDataChkHeadFormat.length;i++){

            if(SettingConfig.PackageDataChkHeadFormat[i].type == 'ChkString'){
                PackageDataChkHead.write(SettingConfig.PackageDataChkHeadFormat[i].contents,
                    SettingConfig.PackageDataChkHeadFormat[i].startPos,
                    SettingConfig.PackageDataChkHeadFormat[i].length);
            }else if(SettingConfig.PackageDataChkHeadFormat[i].type == 'ChkHash'){
                var tmp = TunnelUtils.CreateHash(SettingConfig.PackageDataChkHeadFormat[i].contents);
                (new Buffer(tmp.toString(), 'Hex')).copy(PackageDataChkHead, SettingConfig.PackageDataChkHeadFormat[i].startPos, 0, (new Buffer(tmp.toString(), 'Hex')).length);
            }
        }
        return PackageDataChkHead;
    }

    public getNextPackageOffset() : number{
        var posResult : number = 0 ;
        if(this.PackageDiffMode == 'PackageSize'){
            //Write DataPackageSize to Head
            posResult = this.ReadCacheBuffer.readUInt32BE(this.PackageSizeStarPos) + this.PackageHead.length;
            if (posResult > this.ReadCacheBuffer.length){
                posResult = -1;
            }
        }else if(this.PackageDiffMode == 'PackageSizeLE'){
            //Write DataPackageSize to Head
            posResult = this.ReadCacheBuffer.readUInt32LE(this.PackageSizeStarPos) + this.PackageHead.length;
            if (posResult > this.ReadCacheBuffer.length){
                posResult = -1;
            }
        }else if(this.PackageDiffMode == 'PackageDiff'){
            posResult = this.ReadCacheBuffer.indexOf(this.PackageHead,1);
        }
        return posResult;
    }

    public formatData(inRealData : Buffer){
        var PackageDataBuffer = Buffer.concat([this.PackageDataChkHead,inRealData]);
        if(SettingConfig.PackageDataEncode.type != ''){
            PackageDataBuffer = TunnelUtils.encode(PackageDataBuffer,
                SettingConfig.PackageDataEncode.type,
                SettingConfig.PackageDataEncode.password);
        }

        var len = PackageDataBuffer.length;

        // if(this.PackageDiffMode == 'PackageSize'){
        //     //Write DataPackageSize to Head
        //     var len = PackageDataBuffer.length;
        //     this.PackageHead.writeInt32BE(len,this.PackageSizeStarPos);  
        // }else if(this.PackageDiffMode == 'PackageSizeLE'){
        //     //Write DataPackageSize to Head
        //     var len : number = PackageDataBuffer.length;
        //     this.PackageHead.writeInt32LE(len,this.PackageSizeStarPos);  
        // }else if(this.PackageDiffMode == 'PackageDiff'){
        //     //No Change needed
        // }
        var PackageDataBuffer = Buffer.concat([this.PackageHead,PackageDataBuffer]);

        if(this.PackageDiffMode == 'PackageSize'){            
            PackageDataBuffer.writeInt32BE(len,this.PackageSizeStarPos);  
        }else if(this.PackageDiffMode == 'PackageSizeLE'){
            PackageDataBuffer.writeInt32LE(len,this.PackageSizeStarPos);  
        }
        return PackageDataBuffer;
    }

    public put(inBuffer : Buffer ){
        var pos : number = 0;
        this.ReadCacheBuffer = Buffer.concat([this.ReadCacheBuffer,inBuffer]);


        //Check Conditions 
        do {
            try {
                if(this.ReadCacheBuffer.length < this.PackageHead.length + this.PackageDataChkHead.length)
                    break;

                pos = this.getNextPackageOffset();
                if(pos > 0){
                    
                    //Get InfoDatas
                    var data : Buffer = this.ReadCacheBuffer.slice(0,pos);
                    this.ReadCacheBuffer = this.ReadCacheBuffer.slice(pos);
                    data = data.slice(this.PackageHead.length);
                    if(SettingConfig.PackageDataEncode.type != ''){
                        data = TunnelUtils.decode(data,
                            SettingConfig.PackageDataEncode.type,
                            SettingConfig.PackageDataEncode.password);
                    }
                    //PackageDataChkHead Check
                    if (data.indexOf(this.PackageDataChkHead) == 0)
                        data = data.slice(this.PackageDataChkHead.length);
                    else{
                        this.onErrorHandler('PackageDataChkHead Check Error!');
                        break;
                    }
                    this.onRealDataReceivedHandler(data);                    
                }else{
                    break;
                }
            } catch (error) {
                this.onErrorHandler('PackageHead Check Error!');
                //break;
            }
        } while (true);





    }

    // public put = (inBuffer : Buffer ) => {
        
    //     this.CacheBuffer = Buffer.concat([this.CacheBuffer,inBuffer]);
    //     if(this.CacheBuffer.length >= 9){
    //         this.RealDataReceivedHandler();
    //     }
    // }



}


//For TEST1
// console.time('Demo===');
// let mMode1Package = new CustomPackage();

// mMode1Package.onRealDataReceivedHandler = function(data){
//     console.log('>> receive data:'+ data.toString('hex'));
// };
// mMode1Package.onErrorHandler = function(error){
//     console.log('>> error:'+ error);
// };
// // mMode1Package.formatData(new Buffer([0,9]));
// // mMode1Package.formatData(new Buffer([1,2,3,4,5,6,7]));

// // console.log('>> Formatted Package:' + mMode1Package.formatData(new Buffer([0,9])).toString('Hex'));
// // console.log('>> Formatted Package:' + mMode1Package.formatData(new Buffer([
// //     1,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,
// //     7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,
// //     6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7])).toString('Hex'));

// console.log('>> Formatted PackageHead:'+ mMode1Package.mkPackageHead().toString('Hex'));
// console.log('>> Formatted PackageDataChkHead:'+ mMode1Package.mkPackageDataChkHead().toString('Hex'));

// mMode1Package.put(mMode1Package.formatData(new Buffer([
//     1,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,
//     7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,
//     6,7,2,3,5,6,7,1,2,3,5,6,7,2,3,5,6,7,1,2,3,5,6,7])));
// mMode1Package.put(mMode1Package.formatData(new Buffer([8,9])));
// mMode1Package.put(mMode1Package.formatData(new Buffer([0,3,1,2,3,0,6,1,2,3,4,5,6])));
// mMode1Package.put(mMode1Package.formatData(new Buffer([1,2,3,4,5,6,7])));
// mMode1Package.put(mMode1Package.formatData(new Buffer([8,9])));

// // mMode1Package.put(new Buffer([8,9]));
// mMode1Package.put(mMode1Package.formatData(new Buffer([0,3,1,2,3,0,6,1,2,3,4,5,6])));



// console.time('Demo===');
// //For TEST2 File Trans
// // File -(Encode)> tmpFile -(Decode)> File2

// var input = fs.createReadStream('test/input');
// var output = fs.createWriteStream('test/tmpOutfile');
// var mCustomPackage = new CustomPackage();
// var CountPackage : number = 0;
// input.on('data', function(d) {
//     //Encode to File
//     output.write(mCustomPackage.formatData(d));
//     CountPackage++;
// });
// input.on('error', function(err) { throw err; });
// input.on('end', function() {
//   output.end();
//   console.log('>> Package Number:' + CountPackage);
// //   Decode from File
//   var input1 = fs.createReadStream('test/tmpOutfile');
//   var output1 = fs.createWriteStream('test/outfile');
//   var mCustomPackage1 = new CustomPackage();
//   CountPackage = 0;
//   input1.on('data', function(d) {
//       CountPackage++;
//       mCustomPackage1.put(d);
//   });
//   mCustomPackage1.onRealDataReceivedHandler = function(data){
//       output1.write(data);

//   };
  
//   input1.on('error', function(err) { throw err; });
//   input1.on('end', function() {
//     output1.end();
//     console.log('>> Package Number:' + CountPackage);
//   });
// });

// console.timeEnd('Demo===');


