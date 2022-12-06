package com.lifecycle.services.websocket;

public class ModelResults 
{
	private String results;
	private String user;
	
	public ModelResults(String results, String user)
	{
		this.results = results;
		this.user = user;
	}
	
	public void setResults(String results)
	{
		this.results = results;
	}
	
	public String getResults() 
	{
		return this.results;
	}
	
	public void setUser(String user)
	{
		this.user = user;
	}
	
	public String getUser()
	{
		return this.user;
	}
}
