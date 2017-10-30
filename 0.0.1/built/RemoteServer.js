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
server1.on('connection', function (conn) {
    var exBuffer1 = new ExBuffer();
    var socket1 = new net.Socket({ allowHalfOpen: true });
    conn.setTimeout(30000);
    conn.on('data', function (data) {
        exBuffer1.put(data);
    });
    exBuffer1.on('data', function (buffer) {
        console.log('>> RemoteServer receive data from LocalServer,length:' + buffer.length);
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
        socket1.write(dataBuf.slice(headFrameLen + 24));
    });
    socket1.connect(TargetServerPort, TargetServerHost, function () {
        console.log('RemoteServer CONNECTED TO AppServer ');
    });
    socket1.setKeepAlive(true);
    socket1.on('data', function (data) {
        formatBuff(conn, data);
    });
    function formatBuff(conn, inBuf) {
        var len = inBuf.length;
        if (len > 60000) {
            var tmpBuf = inBuf.slice(0, 60000);
            var MsgDataHeadBuf = Buffer.from(headFrame);
            var MsgDataHeadInfoBuf = Buffer.alloc(24, 255);
            MsgDataHeadInfoBuf.writeInt16BE(0x0101, 0);
            MsgDataHeadInfoBuf.writeInt16BE(0x0000, 2);
            MsgDataHeadInfoBuf.writeInt16BE(0x0000, 4);
            MsgDataHeadInfoBuf.writeInt16BE(0x0000, 6);
            var MsgDataInfoBuf = tmpBuf;
            var dataBuf = Buffer.concat([MsgDataHeadBuf, MsgDataHeadInfoBuf, MsgDataInfoBuf]);
            dataBuf = zip(encode(dataBuf));
            len = dataBuf.length;
            var headBuf = new Buffer(2);
            headBuf.writeUInt16BE(len, 0);
            conn.write(headBuf);
            var bodyBuf = (dataBuf);
            conn.write(bodyBuf);
            formatBuff(conn, inBuf.slice(60000));
        }
        else {
            var MsgDataHeadBuf = Buffer.from(headFrame);
            var MsgDataHeadInfoBuf = Buffer.alloc(24, 255);
            MsgDataHeadInfoBuf.writeInt16BE(0x0101, 0);
            MsgDataHeadInfoBuf.writeInt16BE(0x0000, 2);
            MsgDataHeadInfoBuf.writeInt16BE(0x0000, 4);
            MsgDataHeadInfoBuf.writeInt16BE(0x0000, 6);
            var MsgDataInfoBuf = inBuf;
            var dataBuf = Buffer.concat([MsgDataHeadBuf, MsgDataHeadInfoBuf, MsgDataInfoBuf]);
            dataBuf = zip(encode(dataBuf));
            len = dataBuf.length;
            var headBuf = new Buffer(2);
            headBuf.writeUInt16BE(len, 0);
            conn.write(headBuf);
            var bodyBuf = (dataBuf);
            conn.write(bodyBuf);
        }
    }
    socket1.on('error', function (err) {
        console.log('RemoteServer socket1 error %s', err.message);
    });
    conn.on('error', function (err) {
        console.log('RemoteServer conn error %s', err.message);
    });
    conn.on('end', function () {
        console.log('RemoteServer conn end ');
        socket1.end();
        conn.end();
    });
}).listen(RemoteServer_ListenPort, RemoteServer_ListenHost);
server1.on('error', function (err) {
    console.log('Server2 Error %s', err.message);
});
function encode(inbuf) {
    try {
        var cipher = crypto.createCipher('aes192', '123');
        var encrypted = cipher.update(inbuf);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
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
        var encrypted = zlib.gzipSync(inbuf);
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
//# sourceMappingURL=RemoteServer.js.map