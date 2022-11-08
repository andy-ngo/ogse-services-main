package com.lifecycle.components.processes;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import com.lifecycle.components.io.Folder;

public abstract class Process {

	protected ProcessBuilder pb;

	protected Folder workspace = null;
	protected File tool = null;
	protected FileWriter writer = null;

	public Process() {

	}

	private int execute(Folder output, ProcessBuilder pb) throws IOException, InterruptedException {
		if (this.workspace != null)
			pb.directory(this.workspace.path.toFile());

		pb.redirectErrorStream(true);

		// Files.deleteIfExists(output.path("log.txt"));
		// Files.createFile(output.path("log.txt"));

		// FileWriter writer = new FileWriter(output.path("log.txt").toString());

		java.lang.Process p = pb.start();

		int value = -1;

		while ((value = p.getInputStream().read()) != -1) {
			// writer.write((char) value);
			System.out.print((char) value);
		}

		// writer.close();

		int exit = p.waitFor();

		p.destroy();

		return exit;
	}

	protected int execute(Folder output, List<String> command) throws IOException, InterruptedException {
		return this.execute(output, new ProcessBuilder(command));
	}

	protected int execute(Folder output, String... command) throws IOException, InterruptedException {
		return this.execute(output, new ProcessBuilder(command));
	}
}
