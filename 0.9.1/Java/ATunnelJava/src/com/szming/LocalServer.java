package com.szming;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.szming.Framesets.EventHandler;
import com.szming.utils.Config;

public class LocalServer {

	// public static final int LISTEN_PORT = 8080;

	public void listenRequest() throws InterruptedException {

		ServerSocket serverSocket = null;
		//ExecutorService threadExecutor = Executors.newCachedThreadPool();
		ExecutorService threadExecutor = Executors.newFixedThreadPool(16);
		try {
			serverSocket = new ServerSocket(Config.mSettingConfig.LocalServer_ListenPort);
			System.out.printf("Server listening on port %s ...", Config.mSettingConfig.LocalServer_ListenPort);
			while (true) {
				Socket socket = serverSocket.accept();
				threadExecutor.execute(new RequestThread(socket));
				Thread.sleep(1);

			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (threadExecutor != null)
				threadExecutor.shutdownNow();
			if (serverSocket != null)
				try {
					serverSocket.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}

	/**
	 * RequestThread
	 *
	 * @version
	 */
	class RequestThread implements Runnable {

		private Socket clientSocket;
		private SocketStreamProc mSocketClient;
		private Socket remoteSocket;
		private SocketStreamProc mSocketRemote;

		public RequestThread(Socket clientSocket) throws UnknownHostException, IOException {
			this.clientSocket = clientSocket;
			
			try {
				this.remoteSocket = new Socket(Config.mSettingConfig.RemoteServer_Address,
						Config.mSettingConfig.RemoteServer_ListenPort);
				
//				this.remoteSocket.setSoTimeout(20000);
//				this.clientSocket.setSoTimeout(20000);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				// e.printStackTrace();
				return ;
			}

		}

		@Override
		public void run() {

			System.out.printf("Connect to Remote Sockets : %s!\n", clientSocket.getRemoteSocketAddress());

			if(this.clientSocket == null) {
				closeAll();
				return;	
			}
			if(this.remoteSocket == null)  {
				closeAll();
				return;	
			}
			
			try {
				this.mSocketClient = new SocketStreamProc(this.clientSocket, true, true);
				SocketStreamProc tClient = this.mSocketClient;

				this.mSocketRemote = new SocketStreamProc(this.remoteSocket, false, false);
				SocketStreamProc tRemote = this.mSocketRemote;

				this.mSocketClient.setHandler(new EventHandler() {
					@Override
					public void onRealDataReceivedHandler(byte[] data) {
						// TODO Auto-generated method stub
						System.out.println("mSocketClient onRealDataReceivedHandler");
						try {

							if(tRemote.mSocket == null){
								System.out.println("mSocket died!!");
								closeAll();
								return;	
							}
							if(tRemote.mSocket.isClosed()){
								System.out.println("mSocket died!!");
								closeAll();
								return;	
							}
														
							tRemote.write(data);
							
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}

					@Override
					public void onErrorHandler(String msg) {
						// TODO Auto-generated method stub
						System.out.println("mSocketClient onErrorHandler");
					}

				});

				this.mSocketRemote.setHandler(new EventHandler() {
					@Override
					public void onRealDataReceivedHandler(byte[] data) {
						// TODO Auto-generated method stub
						System.out.println("mSocketRemote onRealDataReceivedHandler");
						
						if(tClient.mSocket == null){
							System.out.println("mSocket died!!");
							closeAll();
							return;	
						}
						if(tClient.mSocket.isClosed()){
							System.out.println("mSocket died!!");
							closeAll();
							return;	
						}
						
						try {
							tClient.write(data);
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}

					@Override
					public void onErrorHandler(String msg) {
						// TODO Auto-generated method stub
						System.out.println("mSocketRemote onErrorHandler");
						closeAll();
					}

				});

				ExecutorService threadExecutor = Executors.newCachedThreadPool();

				threadExecutor.execute(this.mSocketRemote);
				threadExecutor.execute(this.mSocketClient);

			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();

			} finally{

			}

		}
		
		private void closeAll() {
			
			System.out.println("RequestThread close all");
			try {
				if(this.clientSocket != null) 
					this.clientSocket.close();
				if(this.remoteSocket != null)
					this.remoteSocket.close();
			} catch (IOException e) {
			}
			this.clientSocket = null;
			this.remoteSocket = null;
			this.mSocketClient.setHandler(null);
			this.mSocketRemote.setHandler(null);
			this.mSocketClient = null;
			this.mSocketRemote = null;
			
			try {
				this.finalize();
			} catch (Throwable e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		

	}

	/**
	 * RemoteServer main
	 */
	public static void main(String[] args) {
		Config mConfig = new Config();

		if (args.length == 1)
			mConfig.init(args[0]);
		else
			mConfig.init("C:\\Works\\PresonalSource\\ATunnelJava\\SettingConfig.json");


		try {
			LocalServer server = new LocalServer();
			server.listenRequest();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
