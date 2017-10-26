/**
 * 可用的请求转发工具
 * 可加密，可压缩
 * 双向流动
 */

import * as crypto from 'crypto';
import * as zlib from 'zlib';
import * as ExBuffer from 'ExBuffer';
import * as net from 'net';

//LocalServer Setting
const LocalServer_ListenHost : string = "0.0.0.0";
const LocalServer_ListenPort : number = 2204;

//RemoteServer Setting
const RemoteServer_Address : string = "<RemoteServer_Address>";
const RemoteServer_ListenHost : string = "0.0.0.0";
const RemoteServer_ListenPort : number = 8882;

//RemoteServer App Setting
const TargetServerHost : string = "<TargetServerHost>";
const TargetServerPort : number = 22;

const headFrame = "**!!AntiGFWTunnel!!**";
const headFrameLen = Buffer.byteLength(headFrame);

var server1 = net.createServer({allowHalfOpen: true});
var server2 = net.createServer({allowHalfOpen: true});

// //GateServer 1 (Connect to RealServer)

// //RemoteServer
// server1.on('connection', function(conn){
//     var exBuffer1 = new ExBuffer();
//     // setTimeout(() => {

//     // }, 1e3);
//     var socket1 = new net.Socket({allowHalfOpen: true});


//     conn.setTimeout(30000);

//     conn.on('data', function(data) {
//         exBuffer1.put(data);
//     });

//     //当客户端收到完整的数据包时
//     exBuffer1.on('data', function(buffer) {
//         console.log('>> RemoteServer receive data from LocalServer,length:'+ buffer.length);
//         console.log(buffer.toString('Hex'));

//         //数据初始化
//         //var dataBuf = Buffer.from(buffer);
//         var dataBuf = Buffer.from(decode(unzip(buffer)));


//         //验证处理
//         if(dataBuf.toString('UTF8', 0, headFrameLen) != headFrame){
//             console.log('>> wrong head :'+ buffer.length);
//             //conn.end();
//             return;
//         }
//         //机能预留
//         if(dataBuf.readInt16BE(headFrameLen) == 257){
//             console.log('>> head : 0x0000');
//         }else{
//             console.log('>> wrong head info:'+ dataBuf.readInt16BE(headFrameLen));
//             //conn.end();
//             return;
//         }
//         console.log('>> info:'+ dataBuf.slice(headFrameLen + 24));
//         socket1.write(dataBuf.slice(headFrameLen + 24));
//         //
//     });

//     //删除过期连接
//     //TODO



//     socket1.connect(TargetServerPort,TargetServerHost, function() {
//         console.log('RemoteServer CONNECTED TO AppServer ');
//     });
//     socket1.setKeepAlive(true);

//     socket1.on('data', function(data) {
//         console.log('>> RemoteServer receive data from AppServer:'+data);
//         //数据准备
        
//         var MsgDataHeadBuf = Buffer.from(headFrame);
//         var MsgDataHeadInfoBuf = Buffer.alloc(24, 255);
//         MsgDataHeadInfoBuf.writeInt16BE(0x0101, 0);
//         MsgDataHeadInfoBuf.writeInt16BE(0x0000, 2);
//         MsgDataHeadInfoBuf.writeInt16BE(0x0000, 4);
//         MsgDataHeadInfoBuf.writeInt16BE(0x0000, 6);

//         var MsgDataInfoBuf = data;

//         var dataBuf = Buffer.concat([MsgDataHeadBuf, MsgDataHeadInfoBuf,MsgDataInfoBuf]);
//         //数据最终处理
//         dataBuf = zip(encode(dataBuf));

//         var len = Buffer.byteLength(dataBuf);
//         //写入2个字节表示本次包长
//         var headBuf = new Buffer(2);
//         headBuf.writeUInt16BE(len, 0)
//         conn.write(headBuf);
//         var bodyBuf = new Buffer(len);  
//         //数据处理  
//         bodyBuf = (dataBuf);
//         //发送数据
//         conn.write(bodyBuf);
//     });

//     socket1.on('error', function(err) {
//         console.log('RemoteServer socket1 error %s',err.message);
//     });

//     conn.on('error', function(err) {
//         console.log('RemoteServer conn error %s',err.message);
//     });

//     conn.on('end', function() {
//         console.log('RemoteServer conn end ');
//         socket1.end();
//         conn.end();
//     });

// }).listen(RemoteServer_ListenPort,RemoteServer_ListenHost);

// server1.on('error',function(err){
//     console.log('Server2 Error %s',err.message);
// });

//LocalServer
server2.on('connection', function(conn){
    
    var exBuffer1 = new ExBuffer();
    var socket2 = new net.Socket({allowHalfOpen: true});
    var intLen = headFrameLen + 24;
    console.log('>> connection init:'+conn.address);

    conn.on('data', function(data) {
        conn.setTimeout(30000);

        //数据准备
        var MsgDataHeadBuf = Buffer.from(headFrame);
        var MsgDataHeadInfoBuf = Buffer.alloc(24, 255);
        MsgDataHeadInfoBuf.writeInt16BE(0x0101, 0);
        MsgDataHeadInfoBuf.writeInt16BE(0x0000, 2);
        MsgDataHeadInfoBuf.writeInt16BE(0x0000, 4);
        MsgDataHeadInfoBuf.writeInt16BE(0x0000, 6);
        var MsgDataInfoBuf = data;
        var dataBuf = Buffer.concat([MsgDataHeadBuf, MsgDataHeadInfoBuf,MsgDataInfoBuf]);
        //数据最终处理
        dataBuf = zip(encode(dataBuf));
        
        //var len = Buffer.byteLength(dataBuf);
        var len = dataBuf.length;
        //写入2个字节表示本次包长
        var headBuf = new Buffer(2);
        headBuf.writeUInt16BE(len, 0)
        socket2.write(headBuf);
        
        //数据最终处理
        var bodyBuf = (dataBuf);
        
        // 发送数据
        socket2.write(bodyBuf);
    });

    //删除过期连接
    //TODO

    //转送处理
    //192.3.253.147         t2      virmach
    //172.104.113.168       vpn1  lindo
    socket2.connect(RemoteServer_ListenPort,RemoteServer_Address, function() {
        console.log('LocalServer CONNECTED TO RemoteServer ');
    });
    socket2.setKeepAlive(true);
    socket2.on('data', function(data) {
        socket2.setTimeout(30000);
        exBuffer1.put(data);
    });   

    //当客户端收到完整的数据包时
    exBuffer1.on('data', function(buffer) {
        socket2.setTimeout(30000);
        console.log('>> LocalServer receive data,length:'+ buffer.length);

        //数据初始化    
        //var dataBuf = Buffer.from(buffer);
        var dataBuf = Buffer.from(decode(unzip(buffer)));

        //验证处理
        if(dataBuf.toString('UTF8', 0, headFrameLen) != headFrame){
            console.log('>> wrong head :'+ buffer.length);
            //conn.end();
            return;
        }
        //机能预留
        if(dataBuf.readInt16BE(headFrameLen) == 257){
            console.log('>> head : 0x0000');
        }else{
            console.log('>> wrong head info:'+ dataBuf.readInt16BE(headFrameLen));
            //conn.end();
            return;
        }
        //console.log('>> info:'+ dataBuf.slice(headFrameLen + 24));
        conn.write(dataBuf.slice(intLen));
        //
    });

    socket2.on('error', function(err) {
        console.log('socket2 error %s',err.message);
        socket2.end();
        conn.end();
    });

    conn.on('end', function() {
        console.log('LocalServer conn end ');
        socket2.end();
        conn.end();
    });
    conn.on('error', function(err) {
        console.log('conn error %s',err.message);
        conn.end();
    });

    
}).listen(LocalServer_ListenPort,LocalServer_ListenHost);

server2.on('error',function(err){
    console.log('Server2 Error %s',err.message);
});

/**
 * Utils
 *  
 */
//加密
function encode(inbuf) {
    try{
        var cipher = crypto.createCipher('aes192', '123');
        console.log('beforeEncode Size %s', inbuf.length);
        var encrypted = cipher.update(inbuf);
        // encrypted = cipher.final();
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        console.log('afterEncode Size %s', encrypted.length);
    }catch(e){

    }

    return encrypted;
}
function decode(inbuf) {
    try{
        var decipher = crypto.createDecipher('aes192', '123');
        var encrypted = decipher.update(inbuf);
        encrypted = Buffer.concat([encrypted, decipher.final()]);
    }catch(e){

    }
    return encrypted;
}
//压缩
function zip(inbuf) {
    try{
        console.log('beforeEncode Size %s', inbuf.length);
        var encrypted = zlib.gzipSync(inbuf);
        console.log('afterEncode Size %s', encrypted.length);
    }catch(e){

    }

    return encrypted;
}
function unzip(inbuf) {
    try{
        var encrypted = zlib.gunzipSync(inbuf);       
    }catch(e){

    }
    return encrypted;
}