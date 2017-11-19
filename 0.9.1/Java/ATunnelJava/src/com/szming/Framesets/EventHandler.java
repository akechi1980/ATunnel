package com.szming.Framesets;

public interface EventHandler {
	
    public void onRealDataReceivedHandler(byte[] data);
    
    public void onErrorHandler(String msg);
}
