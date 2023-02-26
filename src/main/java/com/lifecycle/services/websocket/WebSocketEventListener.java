package com.lifecycle.services.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;

public class WebSocketEventListener extends TextWebSocketHandler
{
/*
	private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);
	
	@Autowired
	private SimpMessageSendingOperations sendingOperations;
	
	@EventListener
	public void handlesWebSocketConnectListener(final SessionConnectedEvent event)
	{
		LOGGER.info("We have a new connection!");
	}
	
	@EventListener
	public void handleWebSocketDisconnectListener(final SessionConnectedEvent event)
	{
		ModelResults results = new ModelResults();
		
		sendingOperations.convertAndSend("client/connection.close", results);
	}*/

	private Scanner scan = null;

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message)
			throws InterruptedException, IOException, JSONException {

		String payload = message.getPayload();
		System.out.println(payload);
		JSONObject jsonObject = new JSONObject(payload);

		String folder = "Z:\\lome-files\\visualizations";
		String uuid = jsonObject.getString("user");
		Path path = Paths.get(folder, uuid, "messages.log");
		File file = new File(path.toString());
		if (scan == null) scan = new Scanner(file);

		if (!scan.hasNextLine()) scan.close();

		int i = 0;

		session.sendMessage(new TextMessage("UUID: " + jsonObject.get("user") + " - Will now begin showing results in timeframes"));

		while (scan.hasNextLine() && i < 10) {
			session.sendMessage(new TextMessage("File results: " + scan.nextLine()));
			i++;
		}

	}
	
}
