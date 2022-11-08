package com.lifecycle.components.entities;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;

public class Entities<T extends Entity> {

	private File file;
	public List<T> entities;
	private ObjectMapper mapper = new ObjectMapper();
	private Class<T> type;

	public Entities(String s_file, Class<T> type) throws JsonParseException, JsonMappingException, IOException {
		this.file = new File(s_file);
		this.type = type;

		if (!this.file.exists())
			throw new IOException("Cannot read entities, file " + s_file + " does not exist.");

		CollectionType typeReference = TypeFactory.defaultInstance().constructCollectionType(List.class, this.type);

		this.entities = this.mapper.readValue(this.file, typeReference);
	}

	public T Add(T entity) throws Exception {
		this.entities.add(entity);

		entity.setCreated(new Date());

		return entity;
	}

	public void Remove(T entity) {
		this.entities.remove(entity);
	}

	public void Remove(String uuid) throws Exception {
		T meta = this.Get((e) -> e.getUuid().toString().equals(uuid));

		this.Remove(meta);
	}

	public void Remove(UUID uuid) throws Exception {
		this.Remove(uuid.toString());
	}

	public T Update(T curr) throws Exception {
		T prev = this.Get(curr::compareUuid);

		prev.update(curr);

		return prev;
	}

	public void Save() throws JsonGenerationException, JsonMappingException, IOException {
		this.mapper.writeValue(this.file, entities);
	}

	public T Get(ICompare<T> fn) throws Exception {
		return this.entities.stream().filter(w -> fn.IsEqual(w)).findAny()
				.orElseThrow(() -> new Exception("Unable to find entity requested."));
	}

	public Boolean Contains(ICompare<T> fn) throws Exception {
		T entity = this.Get(fn);

		return entity != null;
	}

	public interface ICompare<T> {
		boolean IsEqual(T entity);
	}
}
