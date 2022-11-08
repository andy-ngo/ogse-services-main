package com.lifecycle.components.io;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;

public class UuidFolder extends Folder {
	
	public UUID uuid;
	
	public UuidFolder(String root) throws IOException {
		super(root);
		
		File file;

		do {
			this.uuid = UUID.randomUUID();
			this.path = Paths.get(root, uuid.toString());
			
			file = new File(this.path.toString());
		} while (file.exists());
		
		file.mkdirs();
	}
}
