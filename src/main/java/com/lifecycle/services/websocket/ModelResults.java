package com.lifecycle.services.websocket;

import lombok.Builder;
import lombok.Getter;

@Builder
public class ModelResults 
{
	@Getter
	private String results;
	
	@Getter
	private String user;
}
