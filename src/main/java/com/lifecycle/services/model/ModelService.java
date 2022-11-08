package com.lifecycle.services.model;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifecycle.components.entities.Entities;
import com.lifecycle.components.entities.Entity;
import com.lifecycle.components.entities.Model;
import com.lifecycle.components.io.Folder;
import com.lifecycle.components.io.UuidFolder;

@Service
public class ModelService {
	
	@Value("${app.folders.models}")
	private String APP_FOLDERS_MODELS;
	
	@Value("${app.models}")
	private String APP_MODELS;

    @Autowired
	public ModelService() {

	}
	
    public Entities<Entity> Entities() throws JsonParseException, JsonMappingException, IOException {
    	return new Entities<Entity>(APP_MODELS, Entity.class); 
    }
	
    public File List() throws IOException {
    	return new File(APP_MODELS);
    }
    
    public Entity Create(String name, String description, MultipartFile model) throws Exception {
    	Entities<Entity> models = new Entities<Entity>(APP_MODELS, Entity.class); 
		UuidFolder scratch = new UuidFolder(APP_FOLDERS_MODELS);
		Entity entity = models.Add(new Entity(scratch.uuid, name, description));
		
    	models.Save();
		scratch.copy(model, "model.json");
    	
		return entity;
    }
    
    public Entity Read(String uuid) throws Exception {
		Entities<Entity> models = Entities(); 
    	
		return models.Get((e) -> e.getUuid().toString().equals(uuid));
    }
    
    public File ReadFile(String uuid) throws Exception {
    	Folder folder = new Folder(APP_FOLDERS_MODELS, uuid);
    	
    	return folder.file("model.json");
    }
    
    public Model ReadModel(String uuid) throws Exception {
    	ObjectMapper om = new ObjectMapper();
    	
    	return om.readValue(this.ReadFile(uuid), Model.class);
    }
    
	public Entity Update(String uuid, String name, String description, Date created, MultipartFile model) throws Exception {
		Entities<Entity> models = Entities(); 
		Entity updated = models.Update(new Entity(uuid, name, description, created));
		Folder folder = new Folder(APP_FOLDERS_MODELS, uuid);
		
		models.Save();
	
		if (model != null) folder.copy(model, "model.json");
		
		return updated;
	}
	
    public void Delete(String uuid) throws Exception {
		Entities<Entity> models = Entities(); 
    	Folder folder = new Folder(APP_FOLDERS_MODELS, uuid);

    	folder.delete();
    	models.Remove(uuid);
    	models.Save();
    }
}
