package com.lifecycle.components.serialization.repeatable;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class Serializer extends JsonSerializer<List<Object>> {
    
	@Override
	public void serialize(List<Object> value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
	    ObjectCodec oc = gen.getCodec();
		
    	if (value.size() == 1) oc.writeValue(gen, value.get(0));
    	
    	else oc.writeValue(gen, value);		
	}
    
}