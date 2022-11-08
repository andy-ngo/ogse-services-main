package com.lifecycle.components.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

public class Folder {

	public Path path;
	
	public Folder(Path path) throws IOException {
		this.path = path;
		
		File file = new File(path.toString());
		
		if (!file.exists()) file.mkdirs();
	}
	
	public Folder(String first, String ...more) throws IOException {		
		this(Paths.get(first, more));
	}
	
	public Folder(String root, UUID uuid) throws IOException {		
		this(root, uuid.toString());
	}
	
	public void copy(InputStream f, String file_name) throws IOException {
		Path copy_path = Paths.get(path.toString(), file_name);

		java.nio.file.Files.copy(f, copy_path, StandardCopyOption.REPLACE_EXISTING);
		
		f.close();
	}

	public void copy(MultipartFile f) throws IOException {
		this.copy(f.getInputStream(), f.getOriginalFilename());
	}

	public void copy(File f) throws IOException {
		this.copy(new FileInputStream(f), f.getName());
	}

	public void copy(MultipartFile f, String file_name) throws IOException {
		this.copy(f.getInputStream(), file_name);
	}

	public void copy(File f, String file_name) throws IOException {
		this.copy(new FileInputStream(f), file_name);
	}
	
	public Folder makeFolder(String name) throws IOException {
		Path path = this.path(name);
		
		path.toFile().mkdirs();
		
		return new Folder(path);
	}
	
	public void delete() throws IOException {
		File directory = new File(path.toString());
		
		if (!directory.exists()) throw new IOException("Cannot delete folder " + path.toString() + ", it does not exist.");

		FileSystemUtils.deleteRecursively(directory);
	}
	
	public Path path(String... file_name) {
		return Paths.get(path.toString(), file_name);
	}
	
	public List<File> files() {
		File folder = new File(this.path.toString());
		
		return new ArrayList<>(Arrays.asList(folder.listFiles()));
	}
	
	public List<File> files(String ... file_names) {
		File folder = path(file_names).toFile();

		return new ArrayList<>(Arrays.asList(folder.listFiles()));
	}
	
	public File file(String... file_name) throws Exception {
		String path = path(file_name).toString();
		File file = new File(path);
		
		if (!file.exists()) throw new Exception("File requested does not exist.");
		
		return file;
	}

	
	public static Folder withUUID(String root) throws IOException {
		File file;
		Path path;
		
		do {
			UUID uuid = UUID.randomUUID();
			
			path = Paths.get(root, uuid.toString());
			file = new File(path.toString());
		} while (file.exists());

		file.mkdirs();
		
		return new Folder(path);
	}
	
	public static Folder withUUID(Path root) throws IOException {
		return Folder.withUUID(root.toString());
	}
}
