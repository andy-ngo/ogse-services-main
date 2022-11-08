package com.lifecycle.components.serialization.repeatable;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;

public class Deserializer extends JsonDeserializer<List<Object>> implements ContextualDeserializer {

    private Class<?> contentAs;
    
	@Override
	public JsonDeserializer<?> createContextual(DeserializationContext ctxt, BeanProperty property)
			throws JsonMappingException {

        JsonDeserialize jsonDeserialize = property.getAnnotation(JsonDeserialize.class);
        
        this.contentAs = jsonDeserialize.contentAs();
                
        return this;
	}

	@Override
	public List<Object> deserialize(JsonParser p, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
	    ObjectCodec oc = p.getCodec();
		JsonNode node = oc.readTree(p);
		List<Object> out = new ArrayList<>();

		if (!node.isArray()) {
			out.add(oc.treeToValue(node, this.contentAs));
		}
		
		else for (JsonNode el: node) {
			out.add(oc.treeToValue(el, this.contentAs));
		}
      
        return out;
	}
}