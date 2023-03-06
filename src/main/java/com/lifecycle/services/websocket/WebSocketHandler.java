package com.lifecycle.services.websocket;

import org.json.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
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
	private String APP_FOLDERS_VISUALIZATIONS;

	public WebSocketHandler(String APP_FOLDERS_VISUALIZATIONS)
	{
		this.APP_FOLDERS_VISUALIZATIONS = APP_FOLDERS_VISUALIZATIONS;
	}

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String payload = message.getPayload();
		System.out.println(payload);
		JSONObject jsonObject = new JSONObject(payload);

		String folder = APP_FOLDERS_VISUALIZATIONS;
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
		if (!scan.hasNextLine()) {
			scan.close();
			session.sendMessage(new TextMessage("EOF"));
		}

	}
	
}
