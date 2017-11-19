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

	public static final int LISTEN_PORT = 8080;

	public void listenRequest() {

		ServerSocket serverSocket = null;
		ExecutorService threadExecutor = Executors.newCachedThreadPool();
		try {
			serverSocket = new ServerSocket(LISTEN_PORT);
			System.out.printf("Server listening on port %s ...",LISTEN_PORT);
			while (true) {
				Socket socket = serverSocket.accept();
				threadExecutor.execute(new RequestThread(socket));
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (threadExecutor != null)
				threadExecutor.shutdown();
			if (serverSocket != null)
				try {
					serverSocket.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}

	/**
	 * RemoteServer �N��
	 */
	public static void main(String[] args) {
		Config mConfig = new Config();
		mConfig.init("C:\\Works\\Source\\ATunnelJava\\SettingConfig.json");
		
		LocalServer server = new LocalServer();
		server.listenRequest();
	}

	/**
	 * �|��Client�[�IRequest���s㔁B
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
			this.remoteSocket = new Socket(Config.mSettingConfig.RemoteServer_Address, Config.mSettingConfig.RemoteServer_ListenPort);

		}

		@Override
		public void run() {


			
			System.out.printf("Connect to Remote Sockets : %s!\n", clientSocket.getRemoteSocketAddress());

			try {
				this.mSocketClient = new SocketStreamProc(this.clientSocket,true,true);
				SocketStreamProc tClient = this.mSocketClient;
				
				this.mSocketRemote = new SocketStreamProc(this.remoteSocket,false,false);
				SocketStreamProc tRemote = this.mSocketRemote;
				
				this.mSocketClient.setHandler(new EventHandler() {
					@Override
					public void onRealDataReceivedHandler(byte[] data) {
						// TODO Auto-generated method stub
						System.out.println("mSocketClient onRealDataReceivedHandler");
						try {
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
					}

				});

				ExecutorService threadExecutor = Executors.newCachedThreadPool();
				
				threadExecutor.execute(this.mSocketRemote);
				threadExecutor.execute(this.mSocketClient);

			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

	}
}
