package com.lifecycle.components.processes;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifecycle.components.io.Folder;

public class PythonProcess extends Process {
		
	public PythonProcess(String path) throws IOException {		
		super();
		
		this.tool = new File(path);
		this.workspace = new Folder(tool.getParent());		
	}

	public List<File> execute(Folder scratch, Folder folder, JsonNode params) throws Exception {
		String workflow = folder.path("workflow.json").toString();
		String input = folder.path("data").toString();
		Folder output = new Folder(scratch.path("output"));

		String[] a_command = { this.tool.toString(), workflow, input, output.path.toString() };
		ArrayList<String> command = new ArrayList<>(Arrays.asList(a_command));
				
		if (params != null) {
			ObjectMapper om = new ObjectMapper();
			
		    om.writeValue(scratch.path("params.json").toFile(), params);
		    command.add(scratch.path("params.json").toString());
		}

		int exit = this.execute(output, command);
		
		if (exit != 0) throw new Exception("Unable to execute the workflow.");
		
		return output.files().stream().filter((File f) -> !f.getName().equals("workflow.json")).collect(Collectors.toList());
	}
}
