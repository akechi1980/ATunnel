/**
 * 可用的请求转发工具
 * 可加密，可压缩
 * 双向流动
 */

import * as crypto from 'crypto';
import * as zlib from 'zlib';
import * as net from 'net';

import {SettingConfig} from './utils/Config';
import {CustomPackage} from './Framesets/CustomPackage';

export class RemoteServer{
    RemoteServer : any;

    constructor() {
        SettingConfig.isDebug = false;
        SettingConfig.init("SettingConfig.json");

        this.RemoteServer = net.createServer({allowHalfOpen: true});
        //RemoteServer
        this.RemoteServer.on('connection', this.ServerOnConnection);
        this.RemoteServer.on('error',this.ServerOnError);
    }
   

    ServerStart(){
        console.log('>> RemoteServer Start... %s %s',SettingConfig.RemoteServer_ListenHost,SettingConfig.RemoteServer_ListenPort);
        this.RemoteServer.listen(SettingConfig.RemoteServer_ListenPort,SettingConfig.RemoteServer_ListenHost);
    }

    ServerStop(){
        this.RemoteServer.end();
    }

    ServerOnConnection(conn){
        conn.setKeepAlive(true);
        conn.setNoDelay(true);
 
        // console.log('>> RemoteServer CONNECTED : ' + conn.RemoteServer_Address);
 
        var mCustomPackage = new CustomPackage();
        var mSocket = new net.Socket({allowHalfOpen: true});
        mSocket.setKeepAlive(true);
        mSocket.setNoDelay(true);
        mSocket.connect(SettingConfig.TargetServerPort,SettingConfig.TargetServerHost, function() {
            console.log('>> RemoteServer CONNECTED TO TargetServer');
        });

        conn.on('data', function(data) {
            console.log('>> RemoteServer receive data,length:'+ data.length);
            //conn.pause();
            mCustomPackage.put(data);
            //conn.resume();
        });

        mSocket.on('data', function(data) {

            var tmp = mCustomPackage.formatData(data);
            //console.log('>> RemoteServer send data,length:'+ tmp.length);
            //mSocket.pause();
            conn.write(tmp);
            //mSocket.resume();
            console.log('>> RemoteServer send data,length:'+ data.length);
        });   
        
        //当客户端收到完整的数据包时
        mCustomPackage.onRealDataReceivedHandler = function(data){
            console.log('>> RemoteServer receive package data,length:'+ data.length);
            mSocket.write(data);
        };

        mCustomPackage.onErrorHandler = function(err){
            console.log('RemoteServer mCustomPackage Error %s',err);
            mSocket.end();
            conn.end();
        };

        mSocket.on('error', function(err) {
            console.log('RemoteServer mSocket error %s',err.message);
            mSocket.end();
            conn.end();
        });

        mSocket.on('end', function() {
            console.log('RemoteServer mSocket end');
            mSocket.end();
            conn.end();
        });
        
        conn.on('end', function() {
            console.log('RemoteServer conn end ');
            mSocket.end();
            conn.end();
        });

        conn.on('error', function(err) {
            console.log('RemoteServer conn error %s',err.message);
            mSocket.end();
            conn.end();
        });
    }

    ServerOnError(err){
        console.log('RemoteServer Error %s',err.message);
    }

}

let mRemoteServer = new RemoteServer();
mRemoteServer.ServerStart();