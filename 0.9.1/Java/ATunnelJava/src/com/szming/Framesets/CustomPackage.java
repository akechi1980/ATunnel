package com.szming.Framesets;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.Charset;
import java.util.Arrays;

import com.szming.utils.Config;
import com.szming.utils.TunnelUtils;
import com.szming.utils.JsonParser.PackageDataChkHeadFormat;
import com.szming.utils.JsonParser.PackageHeadFormat;

public class CustomPackage {

	EventHandler iEventHandler;
	// メモリに保存されている情報リスト
	byte[] ReadCacheBuffer;

	byte[] PackageHead;
	byte[] PackageDataChkHead;

	String PackageDiffMode = "PackageDiff"; // PackageSize,PackageSizeLE
	int PackageSizeStarPos = 0;
	int PackageOffset = 0;

	

	public CustomPackage() {
        this.ReadCacheBuffer = new byte[0];
        // WithDataSize Crypt
        this.PackageHead= this.mkPackageHead();
        this.PackageDataChkHead= this.mkPackageDataChkHead();
    }
    
    
	public byte[] mkPackageHead() {

		byte[] PackageHead = new byte[Config.mSettingConfig.PackageHeadLength()];
		Arrays.fill(PackageHead, (byte) 0);

		for (int i = 0; i < Config.mSettingConfig.PackageHeadFormat.length; i++) {
			PackageHeadFormat itemObj = (PackageHeadFormat) Config.mSettingConfig.PackageHeadFormat[i];

			if (itemObj.type.equals("String")) {

				byte[] byteArray = itemObj.contents.getBytes(Charset.forName("utf8"));
				System.arraycopy(byteArray, 0, PackageHead, itemObj.startPos,
						(byteArray.length < itemObj.length ? byteArray.length : itemObj.length));

			} else if (itemObj.type.equals("PackageSize")) {
				this.PackageDiffMode = "PackageSize";
				this.PackageSizeStarPos = itemObj.startPos;

			} else if (itemObj.type.equals("PackageSizeLE")) {
				this.PackageDiffMode = "PackageSizeLE";
				this.PackageSizeStarPos = itemObj.startPos;
			} else if (itemObj.type.equals("Num")) {
			}

		}

		return PackageHead;
	}

	public byte[] mkPackageDataChkHead() {
		byte[] PackageDataChkHead = new byte[Config.mSettingConfig.PackageDataChkHeadLength()];
		Arrays.fill(PackageDataChkHead, (byte) 0);

		for (int i = 0; i < Config.mSettingConfig.PackageDataChkHeadFormat.length; i++) {

			PackageDataChkHeadFormat itemObj = (PackageDataChkHeadFormat) Config.mSettingConfig.PackageDataChkHeadFormat[i];

			if (itemObj.type.equals("ChkString")) {

				byte[] byteArray = itemObj.contents.getBytes(Charset.forName("utf8"));
				System.arraycopy(byteArray, 0, PackageDataChkHead, itemObj.startPos,
						(byteArray.length < itemObj.length ? byteArray.length : itemObj.length));

			} else if (itemObj.type.equals("ChkHash")) {
				// var tmp =
				// TunnelUtils.CreateHash(Config.PackageDataChkHeadFormat[i].contents);
				// (new Buffer(tmp.toString(), "Hex")).copy(PackageDataChkHead,
				// Config.PackageDataChkHeadFormat[i].startPos, 0, (new Buffer(tmp.toString(),
				// "Hex")).length);
			}
		}
		return PackageDataChkHead;
	}

	public void put(byte[] data, boolean isDriect) {

		System.out.println("CustomPackage put " + data.length);

		if (isDriect) {

			// Format判断処理要らない、そのまま出す
			if (data.length > 0) {
				iEventHandler.onRealDataReceivedHandler(data);
			}

		} else {
			// Format判断処理必要、
			int pos = 0;
			this.ReadCacheBuffer = concat(this.ReadCacheBuffer, data);
			// Check Conditions
			do {
				 try {
					 
					 if(this.ReadCacheBuffer.length < this.PackageHead.length + this.PackageDataChkHead.length) break;
					
					 pos = this.getNextPackageOffset();
					 
					 if(pos > 0){
						
						 //処理対象Packageを取得する
						 byte[]  data1 = subBytes(this.ReadCacheBuffer,0,pos);
						 //その他の情報をそのまま維持する
						 this.ReadCacheBuffer = subBytes(this.ReadCacheBuffer,pos,this.ReadCacheBuffer.length - data1.length);
						 //Headをカットする。
						 data1 = subBytes(data1,this.PackageHead.length,data1.length - this.PackageHead.length);
						 
						 if(!Config.mSettingConfig.PackageDataEncode.type.equals("")){
							 //暗号化ある場合
							 data1 = TunnelUtils.decode(data1, Config.mSettingConfig.PackageDataEncode.type, Config.mSettingConfig.PackageDataEncode.password);
						 }
						 
						 //PackageDataChkHead Check
						 if (bytesIndexOf(data1,this.PackageDataChkHead) > 0)
							 //PackageDataChkHeadをカットする。
							 data1 = subBytes(data1,this.PackageDataChkHead.length,data1.length - this.PackageDataChkHead.length);
						 
						 else{
							 iEventHandler.onErrorHandler("PackageDataChkHead Check Error!");
							 break;
						 }
						 
						 iEventHandler.onRealDataReceivedHandler(data1);
						 
					 }else{
						 break;
					 }
				 } catch (Exception ex) {
					 ex.printStackTrace();
					 break;
				 }
			} while (true);
		}

	}

	public int getNextPackageOffset() {
		int posResult = 0;
		if (this.PackageDiffMode.equals("PackageSize")) {
			byte[] tmpLength = subBytes(this.ReadCacheBuffer, this.PackageSizeStarPos, 4);
			posResult = (int) (bytesToint4(tmpLength, true) + this.PackageHead.length);
			if (posResult > this.ReadCacheBuffer.length) {
				posResult = -1;
			}
		} else if (this.PackageDiffMode.equals("PackageSizeLE")) {
			byte[] tmpLength = subBytes(this.ReadCacheBuffer, this.PackageSizeStarPos, 4);
			posResult = (int) (bytesToint4(tmpLength, false) + this.PackageHead.length);
			if (posResult > this.ReadCacheBuffer.length) {
				posResult = -1;
			}
		} else if (this.PackageDiffMode.equals("PackageDiff")) {
			posResult = (int) bytesIndexOf(this.ReadCacheBuffer,this.PackageHead);
			if (posResult < 1) {
				posResult = -1;
			}
		}
		return posResult;
	}

	public byte[] formatData(byte[] inRealData) {
		System.out.println("CustomPackage formatData");
		
		byte[] PackageDataBuffer = concat(this.PackageDataChkHead,inRealData);
        if(!Config.mSettingConfig.PackageDataEncode.type.equals("")){
        	
            PackageDataBuffer = TunnelUtils.encode(PackageDataBuffer,
            		Config.mSettingConfig.PackageDataEncode.type, Config.mSettingConfig.PackageDataEncode.password);
            
        }

        int len = PackageDataBuffer.length;

        PackageDataBuffer = concat(this.PackageHead,PackageDataBuffer);

        if(this.PackageDiffMode.equals("PackageSize")){            
        	PackageDataBuffer = writeInt32BE(PackageDataBuffer , len,this.PackageSizeStarPos);  
        }else if(this.PackageDiffMode.equals("PackageSizeLE")){
            PackageDataBuffer = writeInt32LE(PackageDataBuffer , len,this.PackageSizeStarPos);
        }
        return PackageDataBuffer;

	}
	
	

	public void setHandler(EventHandler iEventHandler) {
		this.iEventHandler = iEventHandler;

	}
	
	
	
	
	//--------------------------------------------
	// Byte Array 操作
	//--------------------------------------------
	public static byte[] concat(byte[] a, byte[] b) {
		if (a == null) a = new byte[0];

		byte[] c = new byte[a.length + b.length];
		System.arraycopy(a, 0, c, 0, a.length);
		System.arraycopy(b, 0, c, a.length, b.length);
		return c;
	}

	public static byte[] subBytes(byte[] src, int begin, int count) {
		byte[] bs = new byte[count];
		System.arraycopy(src, begin, bs, 0, count);
		return bs;
	}
	
	public static byte[] writeInt32BE(byte[] src,int num,int pos){
		byte[] target = intToBytes4(num,true);
		return replace(target,src,pos);
	}
	
	public static byte[] writeInt32LE(byte[] src,int num,int pos){
		byte[] target = intToBytes4(num,false);
		return replace(target,src,pos);
	}
	
	public static byte[] replace(byte[] target, byte[] src,int pos) {
		System.arraycopy(target, 0, src, pos, target.length);
		return src;
	}

	public static byte[] intToBytes8(int x,boolean isBE) {
		ByteBuffer buffer = ByteBuffer.allocate(8);
		if(isBE)
			buffer.order(ByteOrder.BIG_ENDIAN);
		else
			buffer.order(ByteOrder.LITTLE_ENDIAN);	
		
		buffer.putLong(x);
		return buffer.array();
	}

	public static long bytesToint8(byte[] bytes,boolean isBE) {
		ByteBuffer buffer = ByteBuffer.allocate(8);
		if(isBE)
			buffer.order(ByteOrder.BIG_ENDIAN);
		else
			buffer.order(ByteOrder.LITTLE_ENDIAN);	

		buffer.put(bytes, 0, bytes.length);
		buffer.flip();// need flip
		return buffer.getLong();
	}
	
	public static byte[] intToBytes4(int x,boolean isBE) {
		ByteBuffer buffer = ByteBuffer.allocate(4);
		if(isBE)
			buffer.order(ByteOrder.BIG_ENDIAN);
		else
			buffer.order(ByteOrder.LITTLE_ENDIAN);	
		
		buffer.putInt(x);
		return buffer.array();
	}

	public static long bytesToint4(byte[] bytes,boolean isBE) {
		ByteBuffer buffer = ByteBuffer.allocate(4);
		if(isBE)
			buffer.order(ByteOrder.BIG_ENDIAN);
		else
			buffer.order(ByteOrder.LITTLE_ENDIAN);	

		buffer.put(bytes, 0, bytes.length);
		buffer.flip();// need flip
		return buffer.getInt();
	}
	
	public static long bytesIndexOf(byte[] src,byte[] target) {
		
		byte[] tmp = subBytes(src,0,target.length);
		if(java.util.Arrays.equals(tmp, target)) {
			return target.length;
		}else {
			return -1;
		}
//		int pos = java.util.Arrays.asList(src).indexOf(target);
//		return pos;
	}
	

}
