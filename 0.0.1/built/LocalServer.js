"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var zlib = require("zlib");
var ExBuffer = require("ExBuffer");
var net = require("net");
var LocalServer_ListenHost = "0.0.0.0";
var LocalServer_ListenPort = 2204;
var RemoteServer_Address = "<RemoteServer_Address>";
var RemoteServer_ListenHost = "0.0.0.0";
var RemoteServer_ListenPort = 8882;
var TargetServerHost = "<TargetServerHost>";
var TargetServerPort = 22;
var headFrame = "**!!AntiGFWTunnel!!**";
var headFrameLen = Buffer.byteLength(headFrame);
var server1 = net.createServer({ allowHalfOpen: true });
var server2 = net.createServer({ allowHalfOpen: true });
server2.on('connection', function (conn) {
    var exBuffer1 = new ExBuffer();
    var socket2 = new net.Socket({ allowHalfOpen: true });
    var intLen = headFrameLen + 24;
    console.log('>> connection init:' + conn.address);
    conn.on('data', function (data) {
        conn.setTimeout(30000);
        var MsgDataHeadBuf = Buffer.from(headFrame);
        var MsgDataHeadInfoBuf = Buffer.alloc(24, 255);
        MsgDataHeadInfoBuf.writeInt16BE(0x0101, 0);
        MsgDataHeadInfoBuf.writeInt16BE(0x0000, 2);
        MsgDataHeadInfoBuf.writeInt16BE(0x0000, 4);
        MsgDataHeadInfoBuf.writeInt16BE(0x0000, 6);
        var MsgDataInfoBuf = data;
        var dataBuf = Buffer.concat([MsgDataHeadBuf, MsgDataHeadInfoBuf, MsgDataInfoBuf]);
        dataBuf = zip(encode(dataBuf));
        var len = dataBuf.length;
        var headBuf = new Buffer(2);
        headBuf.writeUInt16BE(len, 0);
        socket2.write(headBuf);
        var bodyBuf = (dataBuf);
        socket2.write(bodyBuf);
    });
    socket2.connect(RemoteServer_ListenPort, RemoteServer_Address, function () {
        console.log('LocalServer CONNECTED TO RemoteServer ');
    });
    socket2.setKeepAlive(true);
    socket2.on('data', function (data) {
        socket2.setTimeout(30000);
        exBuffer1.put(data);
    });
    exBuffer1.on('data', function (buffer) {
        socket2.setTimeout(30000);
        console.log('>> LocalServer receive data,length:' + buffer.length);
        var dataBuf = Buffer.from(decode(unzip(buffer)));
        if (dataBuf.toString('UTF8', 0, headFrameLen) != headFrame) {
            console.log('>> wrong head :' + buffer.length);
            return;
        }
        if (dataBuf.readInt16BE(headFrameLen) == 257) {
            console.log('>> head : 0x0000');
        }
        else {
            console.log('>> wrong head info:' + dataBuf.readInt16BE(headFrameLen));
            return;
        }
        conn.write(dataBuf.slice(intLen));
    });
    socket2.on('error', function (err) {
        console.log('socket2 error %s', err.message);
        socket2.end();
        conn.end();
    });
    conn.on('end', function () {
        console.log('LocalServer conn end ');
        socket2.end();
        conn.end();
    });
    conn.on('error', function (err) {
        console.log('conn error %s', err.message);
        conn.end();
    });
}).listen(LocalServer_ListenPort, LocalServer_ListenHost);
server2.on('error', function (err) {
    console.log('Server2 Error %s', err.message);
});
function encode(inbuf) {
    try {
        var cipher = crypto.createCipher('aes192', '123');
        console.log('beforeEncode Size %s', inbuf.length);
        var encrypted = cipher.update(inbuf);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        console.log('afterEncode Size %s', encrypted.length);
    }
    catch (e) {
    }
    return encrypted;
}
function decode(inbuf) {
    try {
        var decipher = crypto.createDecipher('aes192', '123');
        var encrypted = decipher.update(inbuf);
        encrypted = Buffer.concat([encrypted, decipher.final()]);
    }
    catch (e) {
    }
    return encrypted;
}
function zip(inbuf) {
    try {
        console.log('beforeEncode Size %s', inbuf.length);
        var encrypted = zlib.gzipSync(inbuf);
        console.log('afterEncode Size %s', encrypted.length);
    }
    catch (e) {
    }
    return encrypted;
}
function unzip(inbuf) {
    try {
        var encrypted = zlib.gunzipSync(inbuf);
    }
    catch (e) {
    }
    return encrypted;
}
//# sourceMappingURL=LocalServer.js.map