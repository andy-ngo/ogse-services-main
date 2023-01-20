package com.lifecycle.services.demo;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import com.lifecycle.components.io.Folder;

@Service
public class DemoService {
	
	@Value("${app.folders.visualizations}")
	private String APP_FOLDERS_VISUALIZATIONS;
	
	@Autowired
	public DemoService() {
		
	}

	@Autowired
	private SimpMessageSendingOperations sendOps;

	private Scanner scan = null;
	
	//websocket connection methods
	
	//method to get the file
    public File getResults(String uuid) throws Exception
    {
        Folder folder = new Folder (APP_FOLDERS_VISUALIZATIONS,uuid);
        File resultFile = null;
		resultFile = folder.file("messages.log");
        return resultFile;
    }
    
    //method to stream results
    public void sendResults(String uuid) throws Exception
	{
		File resultFile = getResults(uuid);
		if (scan == null) scan = new Scanner(resultFile);

		sendOps.convertAndSend("/client/results.send", scan.nextLine());
		String line = scan.nextLine();
		while (scan.hasNextLine() && line.contains(";")) {
			sendOps.convertAndSend("/client/results.send", line);
			line = scan.nextLine(); //due to this line once it reaches new timeframe that single digit is not sent through websocket
		}
		if(!scan.hasNextLine()) scan.close();
	}


	/* Old sendResults method which only sends 10 lines
	public void sendResults(String uuid) throws Exception
    {
    	File resultFile = getResults(uuid);
		if (scan == null) scan = new Scanner(resultFile);

	    int i = 0;
	    while (scan.hasNextLine() && i < 10) {
			sendOps.convertAndSend("/client/results.send", scan.nextLine());
			i++;
	    }

		if(!scan.hasNextLine()) scan.close();
    }
	*/
}
