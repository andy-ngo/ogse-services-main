package com.lifecycle.services.connect;

import java.net.URI;
import javax.websocket.ClientEndpoint;
import javax.websocket.CloseReason;
import javax.websocket.ContainerProvider;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;

@ClientEndpoint
public class WebSocketClientEndpoint {
	
	Session clientSession = null;
	private MessageHandler messageHandler;
	
	public WebSocketClientEndpoint(URI endpointURI) {
        try {
            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
            container.connectToServer(this, endpointURI);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
	
	@OnOpen
	public void onOpen(Session clientSession) {
		System.out.println("opening websocket");
        this.clientSession = clientSession;
	}
	
	@OnClose
	public void onClose(Session clientSession, CloseReason reason) {
		System.out.println("opening websocket");
        this.clientSession = null;
	}
	
	@OnMessage
	public void onMessage(String message) {
		if (this.messageHandler != null) {
            this.messageHandler.handleMessage(message);
        }
	}
	
	public void addMessageHandler(MessageHandler msgHandler) {
        this.messageHandler = msgHandler;
    }
	
	public void sendMessage(String message) {
        this.clientSession.getAsyncRemote().sendText(message);
    }
	
	public static interface MessageHandler {
        public void handleMessage(String message);
    }
}
