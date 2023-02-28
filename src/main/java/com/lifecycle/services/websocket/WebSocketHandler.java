package com.lifecycle.services.websocket;

import org.json.*;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;

public class WebSocketHandler extends TextWebSocketHandler
{
	private Scanner scan = null;

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String payload = message.getPayload();
		System.out.println(payload);
		JSONObject jsonObject = new JSONObject(payload);
		//TODO: figure out how to get this folder to be @Value thing
		String folder = "Z:\\lome-files\\visualizations";
		String uuid = jsonObject.getString("uuid");
		Path path = Paths.get(folder, uuid, "messages.log");
		File file = new File(path.toString());
		//TODO: possibly change this for sending exactly one single timeframe
		if (scan == null) scan = new Scanner(file);
		String line =  scan.nextLine();
		session.sendMessage(new TextMessage(line));
		do {
			line = scan.nextLine();
			session.sendMessage(new TextMessage(line));
			//System.out.println(line);
		} while(scan.hasNextLine() && line.contains(";"));
		/*session.sendMessage(new TextMessage(scan.nextLine()));
		String line = scan.nextLine();
		while (scan.hasNextLine() && line.contains(";")) {
			session.sendMessage(new TextMessage(line));
			line = scan.nextLine();
		}
		session.sendMessage(new TextMessage(line));*/
		if (!scan.hasNextLine()) scan.close();

	}
	
}
