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
		while (true) {
			try {
				int count = 0;
				while (count == 0) {
					count = input.available();
					Thread.sleep(1);
				}
				byte[] bytes = new byte[count];	

				input.readFully(bytes);				

				mCustomPackage.put(bytes,this.DirectReadMode);
				
				Thread.sleep(1);
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

	}

	public void write(byte[] inbytes) throws IOException {
		byte[] bytes;
		if(this.DirectWriteMode) {
			bytes = inbytes;
		}else {
			bytes = mCustomPackage.formatData(inbytes);
		}
		try {
			this.output.write(bytes);			
		} catch (IOException e) {
		}

	}

}
