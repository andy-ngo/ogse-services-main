package com.lifecycle.services.visualization;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.lifecycle.components.entities.Entities;
import com.lifecycle.components.entities.Entity;
import com.lifecycle.components.io.Folder;
import com.lifecycle.components.io.UuidFolder;
import com.lifecycle.components.io.ZipFile;

@Service
public class VisualizationService {
		
	@Value("${app.folders.visualizations}")
	private String APP_FOLDERS_VISUALIZATIONS;

	@Value("${app.visualizations}")
	private String APP_VISUALIZATIONS;
		
    @Autowired
	public VisualizationService() {

	}
	
    public Entities<Entity> Entities() throws JsonParseException, JsonMappingException, IOException {
    	return new Entities<Entity>(APP_VISUALIZATIONS, Entity.class); 
    }
    
    public File List() throws IOException {
    	return new File(APP_VISUALIZATIONS);
    }
    
    // TODO: Two almost identical methods just ot handle File vs MultipartFile.
    public Entity Create(String name, String description, MultipartFile visualization, MultipartFile structure, MultipartFile messages, List<MultipartFile> data) throws Exception {
    	Entities<Entity> visualizations = new Entities<Entity>(APP_VISUALIZATIONS, Entity.class); 
		UuidFolder scratch = new UuidFolder(APP_FOLDERS_VISUALIZATIONS);
		Entity entity = visualizations.Add(new Entity(scratch.uuid, name, description));

		visualizations.Save();
		scratch.copy(visualization, "visualization.json");
		scratch.copy(structure, "structure.json");
		scratch.copy(messages, "messages.log");

		for (MultipartFile f: data) scratch.copy(f);
		
		return entity;
    }

    public Entity Create(String name, String description, MultipartFile visualization, File structure, File messages, List<File> data) throws Exception {
    	Entities<Entity> visualizations = new Entities<Entity>(APP_VISUALIZATIONS, Entity.class); 
		UuidFolder scratch = new UuidFolder(APP_FOLDERS_VISUALIZATIONS);
		Entity entity = visualizations.Add(new Entity(scratch.uuid, name, description));
		
		visualizations.Save();
		scratch.copy(visualization, "visualization.json");
		scratch.copy(structure, "structure.json");
		scratch.copy(messages, "messages.log");

		for (File f: data) scratch.copy(f);
		
		return entity;
    }
    
    public Entity Read(String uuid) throws Exception {
		Entities<Entity> visualizations = Entities(); 
    	
		return visualizations.Get((e) -> e.getUuid().toString().equals(uuid));
    }
    
    public List<File> ReadFiles(String uuid) throws IOException {
    	Folder folder = new Folder(APP_FOLDERS_VISUALIZATIONS, uuid);
    	
    	return folder.files();
    }
    
    public ZipFile ReadZipFile(String uuid) throws IOException {
    	return new ZipFile(this.ReadFiles(uuid));
    }
    
    public Entity Update(String uuid, String name, String description, Date created, MultipartFile visualization, MultipartFile structure, MultipartFile messages, List<MultipartFile> data) throws Exception {
		Entities<Entity> visualizations = Entities(); 
		Entity updated = visualizations.Update(new Entity(uuid, name, description, created));
		Folder folder = new Folder(APP_FOLDERS_VISUALIZATIONS, uuid);
		
		visualizations.Save();
    	
    	if (visualization != null) folder.copy(visualization, "visualization.json");
    	if (structure != null) folder.copy(structure, "structure.json");
    	if (messages != null) folder.copy(messages, "messages.log");

    	if (data != null) for (MultipartFile f: data) folder.copy(f);
    	
    	return updated;
    }
	
    public void Delete(String uuid) throws Exception {
		Entities<Entity> visualizations = Entities(); 
    	Folder folder = new Folder(APP_FOLDERS_VISUALIZATIONS, uuid);

    	folder.delete();
    	visualizations.Remove(uuid);
    	visualizations.Save();
    }
}
