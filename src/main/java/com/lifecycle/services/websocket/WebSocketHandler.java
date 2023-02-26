package com.lifecycle.services.websocket;

import com.lifecycle.services.visualization.VisualizationService;
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

		String folder = "Z:\\lome-files\\visualizations";
		String uuid = jsonObject.getString("uuid");
		Path path = Paths.get(folder, uuid, "messages.log");
		File file = new File(path.toString());
		if (scan == null) scan = new Scanner(file);
		String line = scan.nextLine();

		while (scan.hasNextLine() && line.contains(";")) {
			session.sendMessage(new TextMessage(line));
			line = scan.nextLine();
		}
		session.sendMessage(new TextMessage(line));
		if (!scan.hasNextLine()) scan.close();

	}
	
}
