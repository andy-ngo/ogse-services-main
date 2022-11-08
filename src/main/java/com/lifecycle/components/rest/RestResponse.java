package com.lifecycle.components.rest;

import java.io.IOException;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class RestResponse {	
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm a z")
	private Date timestamp;

    private int status;
    private String message;
    private String path;

	public static RestResponse build(int status, String message, String path, Date timestamp) throws IOException {
		return new RestResponse(timestamp, status, message, path);
	}

	public RestResponse(Date timestamp, int status, String message, String path) {
		super();
		this.timestamp = timestamp;
		this.status = status;
		this.message = message;
		this.path = path;
	}

	public RestResponse() {
		super();
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
}
