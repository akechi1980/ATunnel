package com.szming.utils;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.stream.JsonReader;
import com.szming.utils.JsonParser.SettingConfig;

public class Config {

	public static String version = "0.9.0";

	public static boolean isDebug = false;

	public static SettingConfig mSettingConfig;

	public static void init(String filename) {
		
		Gson gson = new Gson();
		
		try {
			JsonReader reader = new JsonReader(new FileReader(filename));			
			mSettingConfig = gson.fromJson(reader, SettingConfig.class);
			
			System.out.println(mSettingConfig.LocalServer_ListenHost);
			System.out.println(mSettingConfig.LocalServer_ListenPort);
			
			System.out.println(mSettingConfig.RemoteServer_Address);
			System.out.println(mSettingConfig.RemoteServer_ListenHost);
			System.out.println(mSettingConfig.RemoteServer_ListenPort);
			
			System.out.println(mSettingConfig.TargetServerHost);
			System.out.println(mSettingConfig.TargetServerPort);
			
			System.out.println(mSettingConfig.PackageHeadFormat.length);
			System.out.println(mSettingConfig.PackageHeadFormat[0].startPos);
			System.out.println(mSettingConfig.PackageHeadFormat[0].length);
			System.out.println(mSettingConfig.PackageHeadFormat[0].type);
			System.out.println(mSettingConfig.PackageHeadFormat[0].contents);
			
			System.out.println(mSettingConfig.PackageDataChkHeadFormat.length);

			System.out.println(mSettingConfig.PackageDataEncode.type);
			System.out.println(mSettingConfig.PackageDataEncode.password);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	

	// TEST
	public static void main(String[] args) {
		Config mConfig = new Config();
		mConfig.init("C:\\Works\\Source\\ATunnelJava\\SettingConfig.json");
		System.out.println("-------------------------------------");
		System.out.println(mSettingConfig.LocalServer_ListenHost);
		System.out.println(mSettingConfig.LocalServer_ListenPort);

	}

}
