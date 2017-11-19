package com.szming.utils;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class TestCrypter {

	public static String bytes2HexString(byte[] b) {
		String ret = "";
		for (int i = 0; i < b.length; i++) {
			String hex = Integer.toHexString(b[i] & 0xFF);
			if (hex.length() == 1) {
				hex = '0' + hex;
			}
			ret += hex.toUpperCase();
			ret += ' ';
		}
		return ret;
	}

	public static String ALGORITHM = "AES";
	private static String AES_CBS_PADDING = "AES/ECB/PKCS5Padding";

	public static byte[] encrypt(final byte[] key, final byte[] IV, final byte[] message) throws Exception {
		return TestCrypter.encryptDecrypt(Cipher.ENCRYPT_MODE, key, message);
	}

	public static byte[] decrypt(final byte[] key, final byte[] IV, final byte[] message) throws Exception {
		return TestCrypter.encryptDecrypt(Cipher.DECRYPT_MODE, key, message);
	}

	private static byte[] encryptDecrypt(final int mode, final byte[] key, final byte[] message) throws Exception {

		MessageDigest md = MessageDigest.getInstance("MD5");
		byte[] thedigest = md.digest(key);
		SecretKeySpec skc = new SecretKeySpec(thedigest, "AES");
		Cipher cipher = Cipher.getInstance(AES_CBS_PADDING);
		cipher.init(Cipher.ENCRYPT_MODE, skc);

		return cipher.doFinal(message);
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
	// TEST
	public static void main(String[] args) throws Exception {
		int tmpNumber = 65534;
		System.out.println(bytes2HexString(intToBytes4(tmpNumber,true)));
		
		System.out.println(bytesToint4(intToBytes4(tmpNumber,true),true));

	}

	

}

// static IV = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
// 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
// //............encode............
// /**
// * aes 128 cbc加密 PKCS5Padding填充
// * @param data 原始数据
// * @param key 密钥 设备AccessCode前16个字符
// * @returns 密文Buffer
// */
// public static aes_128_ecb_encrypt(data, key){
// var encipher = crypto.createCipher('aes-128-ecb', Buffer.from(key, 'utf8'));
// var crypted = encipher.update(data, 'utf8', 'binary');
// crypted += encipher.final('binary');
// return Buffer.from(crypted, 'binary');
// }
//
// public static String ALGORITHM = "AES";
// private static String AES_CBS_PADDING = "AES/ECB/PKCS5Padding";
//
// public static byte[] encrypt(final byte[] key, final byte[] IV, final byte[]
// message) throws Exception {
// return TestCrypter.encryptDecrypt(Cipher.ENCRYPT_MODE, key, message);
// }
//
// public static byte[] decrypt(final byte[] key, final byte[] IV, final byte[]
// message) throws Exception {
// return TestCrypter.encryptDecrypt(Cipher.DECRYPT_MODE, key, message);
// }
//
// private static byte[] encryptDecrypt(final int mode, final byte[] key, final
// byte[] message)
// throws Exception {
//
// MessageDigest md = MessageDigest.getInstance("MD5");
// byte[] thedigest = md.digest(key);
// SecretKeySpec skc = new SecretKeySpec(thedigest, "AES");
// Cipher cipher = Cipher.getInstance(AES_CBS_PADDING);
// cipher.init(Cipher.ENCRYPT_MODE, skc);
//
//
// return cipher.doFinal(message);
// }

// NODEJS
// CBC need IV ECB not
// static IV = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
// 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
//// ............encode............
/// **
// * aes 128 cbc加密 PKCS5Padding填充
// * @param data 原始数据
// * @param key 密钥 设备AccessCode前16个字符
// * @returns 密文Buffer
// */
// public static aes_128_cbc_encrypt(data, key){
// var encipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'utf8'),
// this.IV);
// var crypted = encipher.update(data, 'utf8', 'binary');
// crypted += encipher.final('binary');
// return Buffer.from(crypted, 'binary');
// }
//
/// **
// * aes 128 cbc解密，返回解密后的字符串
// * @param crypted 密文
// * @param key 密钥 设备AccessCode前16个字符
// * @returns 明文
// */
// public static aes_128_cbc_decrypt(crypted, key){
// var buf = new Buffer(crypted, 'hex');
// var decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key,
// 'utf8'), this.IV);
// var decoded = decipher.update(buf, 'binary', 'utf8');
// decoded += decipher.final('utf8');
// return decoded;
// }
// JAVA
// public static String ALGORITHM = "AES";
// private static String AES_CBS_PADDING = "AES/CBC/PKCS5Padding";
//
// public static byte[] encrypt(final byte[] key, final byte[] IV, final byte[]
// message) throws Exception {
// return TestCrypter.encryptDecrypt(Cipher.ENCRYPT_MODE, key, IV, message);
// }
//
// public static byte[] decrypt(final byte[] key, final byte[] IV, final byte[]
// message) throws Exception {
// return TestCrypter.encryptDecrypt(Cipher.DECRYPT_MODE, key, IV, message);
// }
//
// private static byte[] encryptDecrypt(final int mode, final byte[] key, final
// byte[] IV, final byte[] message)
// throws Exception {
//
// final Cipher cipher = Cipher.getInstance(AES_CBS_PADDING);
// final SecretKeySpec keySpec = new SecretKeySpec(key, ALGORITHM);
// final IvParameterSpec ivSpec = new IvParameterSpec(IV);
// cipher.init(mode, keySpec, ivSpec);
// return cipher.doFinal(message);
// }
