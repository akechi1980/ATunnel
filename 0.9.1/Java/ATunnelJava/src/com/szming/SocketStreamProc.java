package com.szming;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;
import java.net.UnknownHostException;

import com.szming.Framesets.CustomPackage;
import com.szming.Framesets.EventHandler;

public class SocketStreamProc implements Runnable {
	
	protected Socket mSocket;
	protected DataInputStream input;
	private DataOutputStream output;

	private CustomPackage mCustomPackage;
	
	private boolean DirectReadMode;
	
	private boolean DirectWriteMode;
	
	public SocketStreamProc(Socket inSocket,boolean inReadMode,boolean inWriteMode) throws UnknownHostException, IOException {
		this.mSocket = inSocket;
		this.input = new DataInputStream(inSocket.getInputStream());
		this.output = new DataOutputStream(inSocket.getOutputStream());
		mCustomPackage = new CustomPackage();
		setReadWriteMode(inReadMode,inWriteMode);
		
	}

	public void setHandler(EventHandler iEventHandler) {
		this.mCustomPackage.setHandler(iEventHandler);

	}

	
	public void setReadWriteMode(boolean inReadMode,boolean inWriteMode) {
		this.DirectReadMode = inReadMode;
		this.DirectWriteMode = inWriteMode;
	}
	
	public void run() {
		int intTimeoutCount = 0;
		while (true) {
			try {
				int count = 0;
				
				if(this.input == null) return;
				if(this.mSocket == null) return;
				if(this.mSocket.isClosed()) return;
				
				while (count == 0) {
					
					intTimeoutCount += 1;					
					count = input.available();
					
					if(intTimeoutCount > 6000){
						return;
					}	
					Thread.sleep(10);
					
				}
				byte[] bytes = new byte[count];	

				input.readFully(bytes);				

				mCustomPackage.put(bytes,this.DirectReadMode);
				
				Thread.sleep(10);
				
				intTimeoutCount = 0;
				 
			} catch (IOException e) {
				//e.printStackTrace();
				closeAll("2");
				return;
			} catch (InterruptedException e) {
				//e.printStackTrace();
				closeAll("3");
				return;

			}

		}

	}
	
	
	public void closeAll(String para) {
		
		System.out.println("SocketStreamProc close all" + para);
		try {
			if(this.input != null) 
				this.input.close();
			if(this.output != null) 
				this.output.close();
			if(this.mSocket != null) 
				this.mSocket.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.mCustomPackage = null;
		this.input = null;
		this.output = null;
		this.mSocket = null;
	}

	public void write(byte[] inbytes) throws IOException {


		try {
			byte[] bytes;
			
			if(this.output == null) return;

			if(mSocket == null){
				return;	
			}
			if(mSocket.isClosed()){
				return;	
			}
			
			if(this.DirectWriteMode) {
				bytes = inbytes;
			}else {
				bytes = mCustomPackage.formatData(inbytes);
			}
			
			this.output.write(bytes);			
		} catch (IOException e) {
			e.printStackTrace();
			try {
				this.mSocket.close();
				this.output = null;
				return;
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}

	}

}
