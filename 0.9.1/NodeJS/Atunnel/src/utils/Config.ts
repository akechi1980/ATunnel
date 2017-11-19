/**
 *   SettingConfig
 */
import * as fs from 'fs';

export class SettingConfig{
    public static version : string = "0.0.2"
    
    //............Host And Ports Setting............
    //LocalServer Setting
    public static LocalServer_ListenHost : string = "0.0.0.0";
    public static LocalServer_ListenPort : number = 2204;
    
    //RemoteServer Setting
    public static RemoteServer_Address : string = "172.104.113.168";
    public static RemoteServer_ListenHost : string = "0.0.0.0";
    public static RemoteServer_ListenPort : number = 8882;

    //RemoteServer App Setting
    public static TargetServerHost : string = "<TargetServerHost>";
    public static TargetServerPort : number = 22;

    //............Custom Socket Frameset Format............

    public static PackageHeadFormat : any;
    public static PackageHeadLength : number = 0;
    public static PackageDataChkHeadFormat : any;
    public static PackageDataChkHeadLength : number = 0;
    public static PackageDataEncode : any;

    //............Other Setting............
    public static isDebug : boolean = false;

    //............INIT............
    public static init(filename : string){
       // Get content from file
        var contents = fs.readFileSync(filename);
       // Define to JSON type
        var jsonContent = JSON.parse(contents.toString('UTF8'));

       // Get Value from JSON
        this.LocalServer_ListenHost = jsonContent.LocalServer_ListenHost;
        this.LocalServer_ListenPort = jsonContent.LocalServer_ListenPort;
        this.RemoteServer_Address = jsonContent.RemoteServer_Address;
        this.RemoteServer_ListenHost = jsonContent.RemoteServer_ListenHost;
        this.RemoteServer_ListenPort = jsonContent.RemoteServer_ListenPort;
        this.TargetServerHost = jsonContent.TargetServerHost;
        this.TargetServerPort = jsonContent.TargetServerPort;


        this.PackageHeadFormat = jsonContent.PackageHeadFormat;
        this.PackageDataChkHeadFormat = jsonContent.PackageDataChkHeadFormat;
        this.PackageDataEncode = jsonContent.PackageDataEncode;

        for (var i = 0;i<jsonContent.PackageHeadFormat.length;i++){
            if(this.PackageHeadLength < (jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length))
                this.PackageHeadLength = jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length;
        }

        for (var i = 0;i<jsonContent.PackageDataChkHeadFormat.length;i++){
            if(this.PackageDataChkHeadLength < (jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length))
                this.PackageDataChkHeadLength = jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length;
        }


        if (this.isDebug) {
            console.log("---------------------------------------");
            console.log("LocalServer_ListenHost:", jsonContent.LocalServer_ListenHost);
            console.log("LocalServer_ListenPort:", jsonContent.LocalServer_ListenPort);
            console.log("RemoteServer_Address:", jsonContent.RemoteServer_Address);
            console.log("RemoteServer_ListenHost:", jsonContent.RemoteServer_ListenHost);
            console.log("RemoteServer_ListenPort:", jsonContent.RemoteServer_ListenPort);
            console.log("TargetServerHost:", jsonContent.TargetServerHost);
            console.log("TargetServerPort:", jsonContent.TargetServerPort);
            console.log("---------------------------------------");
            console.log("PackageHeadFormat:", jsonContent.PackageHeadFormat.length);
            for (var i = 0;i<jsonContent.PackageHeadFormat.length;i++){
                if(this.PackageHeadLength < (jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length))
                    this.PackageHeadLength = jsonContent.PackageHeadFormat[i].startPos + jsonContent.PackageHeadFormat[i].length;
                console.log("   ---------------------------------------");
                console.log("   startPos:" + jsonContent.PackageHeadFormat[i].startPos);
                console.log("   length:" + jsonContent.PackageHeadFormat[i].length);
                console.log("   type:" + jsonContent.PackageHeadFormat[i].type);
                console.log("   contents:" + jsonContent.PackageHeadFormat[i].contents);
            }
            console.log("PackageHeadLength:" + this.PackageHeadLength);

            console.log("PackageDataChkHeadFormat:", jsonContent.PackageDataChkHeadFormat.length);
            for (var i = 0;i<jsonContent.PackageDataChkHeadFormat.length;i++){
                if(this.PackageDataChkHeadLength < (jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length))
                    this.PackageDataChkHeadLength = jsonContent.PackageDataChkHeadFormat[i].startPos + jsonContent.PackageDataChkHeadFormat[i].length;

                console.log("   ---------------------------------------");
                console.log("   startPos:" + jsonContent.PackageDataChkHeadFormat[i].startPos);
                console.log("   length:" + jsonContent.PackageDataChkHeadFormat[i].length);
                console.log("   type:" + jsonContent.PackageDataChkHeadFormat[i].type);
                console.log("   contents:" + jsonContent.PackageDataChkHeadFormat[i].contents);
            }
            console.log("PackageDataChkHeadLength:" + this.PackageDataChkHeadLength);
            console.log("---------------------------------------");
            console.log("PackageDataEncode.type:", jsonContent.PackageDataEncode.type);
            console.log("PackageDataEncode.password:", jsonContent.PackageDataEncode.password);
       }
    }
}


//SettingConfig.isDebug = true;
// SettingConfig.init("SettingConfig.json");
// console.log("---------------------------------------");
// console.log("TargetServerPort:", SettingConfig.TargetServerPort);

// {
//     "LocalServer_ListenHost": "0.0.0.0",
//     "LocalServer_ListenPort": 2204,

//     "RemoteServer_Address": "192.168.0.19",
//     "RemoteServer_ListenHost": "0.0.0.0",
//     "RemoteServer_ListenPort": 8882,

//     "TargetServerHost": "0.0.0.0",
//     "TargetServerPort": 18889,
    

//     "PackageHeadFormat" :[
//       {"startPos": 0,"length": 2,"type": "String","contents": "CN"},
//       {"startPos": 2,"length": 6,"type": "PackageSize","contents": ""},               
//       {"startPos": 6,"length": 4,"type": "Num","contents": "00.0001"}
//     ],

//     "PackageDataChkHeadFormat" :[
//       {"startPos": 0,"length": 8,"type": "ChkString","contents": "Atunnel"},
//       {"startPos": 8,"length":32,"type": "ChkHash","contents": "=!!XX!!="}],
    
//     "PackageDataEncode" :{"type": "aes192","password": "124578369"}

//   }
  