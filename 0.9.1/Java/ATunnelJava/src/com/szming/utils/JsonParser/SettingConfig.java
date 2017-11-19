package com.szming.utils.JsonParser;

public class SettingConfig {
	
	public String LocalServer_ListenHost = "0.0.0.0";
	public int LocalServer_ListenPort = 2204;

	// RemoteServer Setting
	public String RemoteServer_Address = "172.104.113.168";
	public String RemoteServer_ListenHost = "0.0.0.0";
	public int RemoteServer_ListenPort = 8882;

	// RemoteServer App Setting
	public String TargetServerHost = "<TargetServerHost>";
	public int TargetServerPort = 22;
	
	public PackageDataChkHeadFormat[] PackageDataChkHeadFormat;
	public PackageHeadFormat[] PackageHeadFormat;
	
	public PackageDataEncode PackageDataEncode;
	
	public int PackageHeadLength() {
		return 8;
	}
	
	public int PackageDataChkHeadLength() {
		return 24;
	}
}
