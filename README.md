## ATunnel

**Introduction**
	
	ATunnel is a simple port proxy tool,  Which you can easy to define your own Socket Package Format. 
	if you can't access your appserver directly , try this...
		
**How To Use**
		
	At first , you need nodejs env.
		On Linux yum install Nodejs (more info https://nodejs.org/en/download/package-manager/)
		On Windows install the Nodejs.msi (which your can finde on https://nodejs.org/)
	Then
		download the Atunnel ,and save to some place your like.
		On Server
			node built/RemoteServer.js
		On Local
			node built/LocalServer.js
	
	you can start it use forever command.
		forever start built/RemoteServer.js
		forever start built/LocalServer.js
	

**SettingConfig**

	{
	    "LocalServer_ListenHost": "0.0.0.0",	//LocalServer Listen IP, 0.0.0.0 = every ip this pc have	
	    "LocalServer_ListenPort": 8000,		//LocalServer Listen port	

	    "RemoteServer_Address": "192.168.8.32",	//RemoteServer IP Address
	    "RemoteServer_ListenHost": "0.0.0.0",	//RemoteServer  Listen IP
	    "RemoteServer_ListenPort": 4002,		//RemoteServer Listen port

	    "TargetServerHost": "192.168.8.127",	// Which Server you wanna go to...
	    "TargetServerPort": 22,			// Port, RDP 3389 ,SSH 22, something else you like


	    "PackageHeadFormat" :[
	      {"startPos": 0,"length": 2,"type": "String","contents": "CN"},
	      {"startPos": 2,"length": 4,"type": "PackageSize","contents": ""},     
	      {"startPos": 6,"length": 2,"type": "String","contents": "NY"}        
	    ],

	    "PackageDataChkHeadFormat" :[
	      {"startPos": 0,"length": 8,"type": "ChkString","contents": "Atunnel"},
	      {"startPos": 8,"length": 8,"type": "ChkString","contents": "Atunnel"},
	      {"startPos": 16,"length": 8,"type": "ChkString","contents": "Atunnel"}],

	    "PackageDataEncode" :{"type": "aes192","password": "124578369"}

	  }
	  
	  Use PackageHeadFormat,PackageDataChkHeadFormat,PackageDataEncode to Define your own Package Format...
	  
	 in SettingConfig's case, the Package Format will be like this
         +-----+-------------+-----+---------+---------+---------+----------+
         | CN  | PackageSize | NY  | ChkStr1 | ChkStr2 | ChkStr3 | RealData |
         |2byte|    4byte    |2byte|  8byte  |  8byte  |  8byte  |     XX   |
         +-----+-------------+-----+---------+---------+---------+----------+
	 the contents of PackageDataChkHeadFormat and RealData will be encoded by PackageDataEncode.
	 
	 You can not only chanage the string or size or crypt method, but also can easyly define your own package format by just alter the SettingConfig.
	 
         +-------------+--------+---------+
         | PackageSize |ChkStr1 |RealData |
         |    4byte    | 8byte  |    XX   |	   
         +-------------+--------+---------+
	OR
	 +-------------+---------+
         | PackageDiff |RealData |
         |    >16byte  |    XX   |		 
         +-------------+---------+
	Will alse work...
	

>**Attations:** 
	You are free to use these code, if you may，just let me know。
	any help or advice will be appreciated
  
>**注意:** 	
	你可以自由使用这些代码，如果可以的话，请告诉我。
	任何帮助或建议都将受到赞赏。
